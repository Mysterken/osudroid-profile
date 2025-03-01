import axios from 'axios';
import * as cheerio from 'cheerio';
import type { Element } from 'domhandler';
import { parsePlayerFromScraper } from '$lib/models/player';

const OSUDROID_PROFILE_URL = 'https://osudroid.moe/profile.php';

export async function scrapeUserData(uid: string) {
	try {
		const response = await axios.get(`${OSUDROID_PROFILE_URL}?uid=${uid}`);
		const $ = cheerio.load(response.data);

		if ($('main.content-wrapper').text().includes('User not found.')) {
			console.warn(`User ${uid} not found`);
			return null;
		}

		const slideshows = $('#slideshow');
		const tablesTr = $('table tr');

		const topPlays = slideshows.first().parent().next().find('li');
		const recentPlays = slideshows.eq(1).first().parent().next().find('li');

		const getMapRank = (imageSource: string | undefined): string => {
			const match = imageSource?.match(/ranking-(\w+)\.png/);
			if (match && match[1]) {
				return match[1];
			}
			throw new Error('Invalid map rank image source');
		}

		const getHashValue = (hashString: string): string => {
			const match = hashString.match(/^{""hash":([a-zA-Z0-9]+)}/);
			if (match && match[1]) {
				return match[1];
			}
			throw new Error('Invalid hash string format');
		};


		const parsePlays = (plays: cheerio.Cheerio<Element>) =>
			plays
				.map((_i, el) => ({
					rank: getMapRank($(el).find('img').attr('src')),
					title: $(el).find('strong').text(),
					date: $(el).find('small').text().split(' / ')[0].trim(),
					pp: parseInt($(el).find('small').text().split(' / ')[1].replace('pp: ', '').trim()),
					score: parseInt(
						$(el)
							.find('small')
							.text()
							.split(' / ')[2]
							.replace('score: ', '')
							.replace(/,/g, '')
							.trim()
					),
					mod: $(el).find('small').text().split(' / ')[3].replace('mod: ', '').trim(),
					combo: parseInt(
						$(el)
							.find('small')
							.text()
							.split(' / ')[4]
							.replace('combo: ', '')
							.replace(' x', '')
							.trim()
					),
					accuracy: parseFloat(
						$(el)
							.find('small')
							.text()
							.split(' / ')[5]
							.replace('accuracy: ', '')
							.replace('%', '')
							.trim()
					),
					miss: parseInt($(el).find('small').next().text().replace('miss: ', '').trim()),
					hash: getHashValue($(el).find('span#statics').text())
				}))
				.get();

		const topPlaysData = parsePlays(topPlays);
		const recentPlaysData = parsePlays(recentPlays);

		const returnData = {
			uid: parseInt(uid),
			username: $('.topnav a').first().text(),
			location: $('p:contains("Location:") a').text().trim(),
			scoreRank: parseInt($('.topnav p:contains("Score Rank:") a').text().replace('#', '').trim()),
			ppRank: parseInt($('.topnav p:contains("PP Rank:") a').text().replace('#', '').trim()),
			rankedScore: parseInt(tablesTr.eq(0).find('td').eq(1).text().replace(/,/g, '').trim()),
			performancePoints: parseInt(tablesTr.eq(1).find('td').eq(1).text().replace(/,/g, '').trim()),
			hitAccuracy: parseFloat(
				tablesTr.eq(2).find('td').eq(1).text().replace('%', '').trim()
			),
			playcount: parseInt(
				tablesTr.eq(3).find('td').eq(1).text().replace(/,/g, '').trim()
			),
			topPlays: topPlaysData,
			recentPlays: recentPlaysData
		};

		return parsePlayerFromScraper(returnData);
	} catch (error) {
		console.error(`Error scraping user ${uid}:`, error);
		throw new Error('Failed to fetch user data');
	}
}
