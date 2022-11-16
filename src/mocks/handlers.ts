import { rest } from 'msw';
import * as path from 'path';
import * as fs from 'fs/promises';
import { poeSecondResponse } from './poeSecondResponse';
import { mockPoeTradeDataItems } from './mock-poe-trade-data-items';

export const queryId = {
  card: 'QbP9X5etw',
  item: '2P3VgKYsk',
};

export const poeFirstResponse = {
  card: {
    id: 'QbP9X5etw',
    complexity: 4,
    result: [
      '1d8fcdddf74be7491e9937e110a7f95f3c729151e27c8f837fa3a4a96d548aec',
      '915563afbbdc0ad3d51133c0b7a3c7499c28a49ceb46450397e69ce50158fdf1',
      '252ff42f6c971e653644682aceedcfbdd29d1dda6f8c3b9315d1964bf2c7e824',
      'a1ab7d39d072e6bc5e614113ac15abf4a88ff869448bf47124503106df2240a2',
      'b44998958abf113368f42b7d8808fc245e3c21c4270c3015e260574815c7f787',
      'ffd7f12724729e21b819644c11021aac2a188c7e5e676b4bda263a6af4904d00',
      'cd637465947dccceb95280402a654c18f0b5ffe1bb06aa5c39477ad2c2986c49',
      '8e0b9924f1f87416c26c7350c9a450fac4858ce39ce7ac3a8e151ef85e4a68a2',
      'a8c3ceea337a79cd97904cec3c0d168763315f32195f52dd55fefe8b9310dfff',
      '61c1512d452c14cd4a14b1b50d5af38a3d0d1832631b29db795d349ebf7d5c3a',
      'd00df3d3b33520c686417c699fe9a2a212c64d6e7514359a845a06b61bbcd145',
      'c1872a1c02f6af55ef540b8596e5a48fc5435292295572bd37be07fa0fea7cdd',
      'c3a430da7575f8ce94a68e371eb429a5a223cfe28ad50b9fac577e5f47ca99b9',
      '064ec14d07fab293253f328ba04fbe12b70bed0deb8a3104e61a54a067d058dc',
    ],
    total: 14,
  },
  item: {
    id: '2P3VgKYsk',
    complexity: 8,
    result: [
      '22a966b9f60e0fddd2f1e277117232cb5d67225573e33ad0630e70b3472fbebd',
      'c4fc616c5c699b78a9f8a90a3e28b55423447b81495cfb0163161a47eea40145',
      'd07dd0c5b8805b7bff2496ea2df5b1f4930c08e47c33e55d3828cddd3eeb8be6',
      '07c8ab01644d66929a82bd62c4fb69cd011a7be346003934f83a587d66f79263',
      'a1e72809b799a79d763633b0fc0b66c678ea082e2d314f9216469897b7713c6d',
      'd198403b9f7d8cf75c45622d9197eb37ac0cdbe2a0dc35b5a271085ede9752c9',
      '3f1ce0b770936a064df46a0ab1d555d0a3bca860812f03e0a40dde9d4da57647',
      'f0c5d34d0afc4c8d4fbf3f6be3bb2ff168bb334b1ebc73d2ed46f66cfc7474c3',
      'd7f5555fab0f267dae11cf8078b2a2c52baeaeacabee55903bfadec28ddbc3a3',
      '33df56d96babf2a74d1ec9ee1ea6566678dea4b9c9e2e550b1a8e9f3b65648bf',
      'c7c7ae1c78e3d8ddfa5b8643867728a5a563d3a277fb91a02cd592dd6d41017e',
      '3ef4fb67f2a8d097cb8453440f89f15ccccf0af4ec07a1d53c2cc58c8fd132a9',
      '85e4fe318340aab9f45a93953e7d959b6f1bf001022269b8fb2968fd4858436f',
      'a0b232b19ddf4c13569faa9e8a80543be3028f5e517041d513108cff4e9d1151',
      '32fe443ca93b1c8818090182b9d05a809090587bff13b253ca8fc9e1a0dbcb4c',
      'bd73e46a5942d20c2ac00b6c4f5803193d93283eb2ec39e5f75c28f2171e5d78',
    ],
    total: 16,
  },
};
export const poeHandlers = [
  rest.get(
    'https://www.pathofexile.com/api/trade/data/leagues',
    async (_req, res, ctx) => {
      return res(
        ctx.json({
          result: [
            {
              id: 'Kalandra',
              realm: 'pc',
              text: 'Kalandra',
            },
            {
              id: 'Hardcore Kalandra',
              realm: 'pc',
              text: 'Hardcore Kalandra',
            },
            {
              id: 'Standard',
              realm: 'pc',
              text: 'Standard',
            },
            {
              id: 'Hardcore',
              realm: 'pc',
              text: 'Hardcore',
            },
            {
              id: 'Kalandra',
              realm: 'xbox',
              text: 'Kalandra',
            },
            {
              id: 'Hardcore Kalandra',
              realm: 'xbox',
              text: 'Hardcore Kalandra',
            },
            {
              id: 'Standard',
              realm: 'xbox',
              text: 'Standard',
            },
            {
              id: 'Hardcore',
              realm: 'xbox',
              text: 'Hardcore',
            },
            {
              id: 'Kalandra',
              realm: 'sony',
              text: 'Kalandra',
            },
            {
              id: 'Hardcore Kalandra',
              realm: 'sony',
              text: 'Hardcore Kalandra',
            },
            {
              id: 'Standard',
              realm: 'sony',
              text: 'Standard',
            },
            {
              id: 'Hardcore',
              realm: 'sony',
              text: 'Hardcore',
            },
          ],
        }),
      );
    },
  ),
  rest.get(
    'https://www.pathofexile.com/api/trade/data/items',
    async (_req, res, ctx) => {
      return res(ctx.json(mockPoeTradeDataItems));
    },
  ),
  rest.post(
    'https://www.pathofexile.com/api/trade/search/:league',
    async (req, res, ctx) => {
      const { body } = await req.json();
      if (body === queryId.card) {
        return res(ctx.json(poeFirstResponse.card));
      } else return res(ctx.json(poeFirstResponse.item));
    },
  ),
  rest.get(
    'https://www.pathofexile.com/api/trade/fetch/:ids',
    async (req, res, ctx) => {
      const reqQuery = req.url.searchParams.get('query');
      if (reqQuery === queryId.card) {
        return res(ctx.json(poeSecondResponse.card));
      } else return res(ctx.json(poeSecondResponse.item));
    },
  ),
];

export default poeHandlers;
