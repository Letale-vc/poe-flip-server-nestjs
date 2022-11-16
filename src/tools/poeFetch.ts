export const getLeagueName = async () => {
  try {
    const leaguePoeResponse = await fetch(
      'https://www.pathofexile.com/api/trade/data/leagues',
    );

    const leagueData = await leaguePoeResponse.json();
    const leagueName = leagueData.result[0].text;
    return leagueName;
  } catch (err) {
    if (err instanceof Error) throw new Error(err.message);
    throw new Error('UnknownException');
  }
};

export const poeFirsRequest = async (firstUrl, bodyJson) => {
  try {
    const response = await fetch(firstUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: bodyJson,
    });
    return response.json();
  } catch (err) {
    if (err instanceof Error) throw new Error(err.message);
    throw new Error('UnknownException');
  }
};

export const poeSecondRequest = async (
  secondUrl,
  resultIdsArrayString: string,
  queryId: string,
) => {
  try {
    const response = await fetch(
      `https://www.pathofexile.com/api/trade/fetch/${resultIdsArrayString}?query=${queryId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.json();
  } catch (err) {
    if (err instanceof Error) throw new Error(err.message);
    throw new Error('UnknownException');
  }
};
