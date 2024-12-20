export const searchSampleData = {
  data: [
    {
      index: 1,
      title: 'State of Grace',
      year: 2012,
      totalPlays: 227,
      album: {
        id: 13,
        title: 'Red',
      },
      writers: [
        {
          writer: {
            name: 'Taylor Swift',
          },
        },
      ],
      artists: [
        {
          artist: {
            name: 'Taylor Swift',
          },
        },
      ],
    },
    {
      index: 2,
      title: 'Beautiful Eyes',
      year: 2008,
      totalPlays: 418,
      album: {
        id: 6,
        title: 'Beautiful Eyes',
      },
      writers: [
        {
          writer: {
            name: 'Taylor Swift',
          },
        },
      ],
      artists: [
        {
          artist: {
            name: 'Taylor Swift',
          },
        },
      ],
    },
  ],
  pagination: {
    total: 172,
    page: 1,
    limit: 2,
    totalPages: 86,
  },
};

export const searchSampleBadRequest = {
  message: 'Validation failed',
  errors: [
    {
      field: 'orderBy',
      message:
        'Invalid orderBy value. Use songName, albumName, year, totalPlays',
    },
  ],
};
