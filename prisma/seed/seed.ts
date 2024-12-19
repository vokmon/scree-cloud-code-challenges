import { Album, Person, PrismaClient, Song } from '@prisma/client';
import fs from 'fs';
import csvParser from 'csv-parser';

const prisma = new PrismaClient();

type SongData = {
  title: string;
  artist: string;
  writer: string;
  album: string;
  year: number;
  totalPlays: number;
} & PlaysData;

type PlaysData = {
  playsJanuary: number;
  playsFebuary: number;
  playsMarch: number;
  playsApril: number;
  playsMay: number;
  playsJune: number;
  playsJuly: number;
  playsAugust: number;
  playsSeptember: number;
  playsOctober: number;
  playsNovember: number;
  playsDecember: number;
};
const Months = [
  'January',
  'Febuary',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

async function main() {
  const id = 'Seeding';
  console.time(id);
  console.log('Start seeding ....');

  const songData = await loadCsv();
  const personList = await addPerson(songData);
  const albumList = await addAlbum(songData);
  await addSongs(songData, personList, albumList);

  console.log('Finish seeding ....');
  console.timeEnd(id);
}

function loadCsv(): Promise<SongData[]> {
  return new Promise((resolve) => {
    const songsData = [];

    // Replace with the path to your CSV file
    const csvFilePath = './prisma/seed/data/SwiftCloud_seed.csv';

    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (row) => {
        // Map the CSV data to the appropriate structure for the Prisma model
        const playsData = {};
        Months.forEach((month) => {
          playsData[`plays${month}`] = parseInt(row[`Plays - ${month}`]);
        });
        const song: SongData = {
          title: row.Song,
          artist: row.Artist,
          writer: row.Writer,
          album: row.Album,
          year: parseInt(row.Year),
          totalPlays: parseInt(row.TotalPlays),
          ...(playsData as PlaysData),
        };
        songsData.push(song);
      })
      .on('end', () => {
        resolve(songsData);
      });
  });
}

async function addPerson(songData: SongData[]): Promise<Person[]> {
  const artists = songData.map((song) => song.artist);
  const writers = songData.map((song) => song.writer);

  const artistNames = getDistinctNames(
    artists,
    /\s*\nfeaturing\s*|\s*\nand\s*/,
  );

  const writerNames = getDistinctNames(writers, /\s*\n\s*/);

  const people = [...new Set([...artistNames, ...writerNames])];
  const personPromises = people.map((person: string) => {
    return prisma.person.create({
      data: { name: person },
    });
  });

  const result = await Promise.all(personPromises);
  return result;
}

async function addAlbum(songData: SongData[]): Promise<Album[]> {
  const albums = songData.map((song) => song.album);
  const albumPromises = albums.map((allbum: string) => {
    return prisma.album.create({
      data: { title: allbum },
    });
  });

  const result = await Promise.all(albumPromises);
  return result;
}

async function addSongs(
  songData: SongData[],
  personList: Person[],
  albumList: Album[],
): Promise<Song[]> {
  const currentYear = new Date().getFullYear();

  const songPromises = songData.map(async (song) => {
    const album = albumList.find((album) => album.title === song.album);

    const savedSong = await prisma.song.create({
      data: {
        title: song.title,
        albumId: album.id,
        year: song.year,
        totalPlays: song.totalPlays,
      },
    });

    const artists = personList.filter((person) =>
      song.artist.includes(person.name),
    );

    const artistsPromise = artists.map((artist) =>
      prisma.songArtist.create({
        data: {
          songId: savedSong.id,
          personId: artist.id,
        },
      }),
    );

    const writers = personList.filter((person) =>
      song.artist.includes(person.name),
    );

    const writersPromise = writers.map((writer) =>
      prisma.songWriter.create({
        data: {
          songId: savedSong.id,
          personId: writer.id,
        },
      }),
    );

    const plays = createPlays(song, savedSong.id, currentYear);
    await Promise.all([...plays, ...artistsPromise, ...writersPromise]);
    return savedSong;
  });

  const result = await Promise.all(songPromises);
  return result;
}

function createPlays(song: SongData, songId: number, year: number) {
  return Months.map((month, index) => {
    return prisma.play.create({
      data: {
        songId: songId,
        month: index + 1,
        year: year,
        playCount: song[`plays${month}`],
      },
    });
  });
}

function getDistinctNames(data: string[], regEx): string[] {
  const nameSet = new Set<string>();

  data.forEach((entry) => {
    // Split on "\nfeaturing" and "\nand"
    const names = entry.split(regEx);

    // Trim and add each name to the set
    names.forEach((name) => {
      nameSet.add(name.trim());
    });
  });

  return Array.from(nameSet);
}

main();
