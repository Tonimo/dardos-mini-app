import { createSignal, For, type Component } from 'solid-js';

import { Page } from '@/components/Page/Page.js';

import './IndexPage.css';
import { createStore } from 'solid-js/store';

export const IndexPage: Component = () => {
  const players1: { name: string; hits: number[]; score: number }[] = [];
  ['Antu', 'Noé', 'Puchy', 'Nico'].forEach((name) => {
    players1.push({
      name,
      hits: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0,
      ],
      score: 0,
    });
  });

  const [players, setPlayers] = createStore(players1);
  const [index, setIndex] = createSignal(0);
  const [dardos, setDardos] = createSignal(3);
  const [overkill, setOverkill] = createSignal(false);

  function hit(num: number, times: number = 1) {
    setOverkill(false);
    if (num != 0) {
      const hits = players[index()].hits.concat([]);
      hits[num] += times;

      if (hits[num] > 3) {
        if (
          players[(index() + 2) % 4].hits[num] == 3 &&
          (players[(index() + 1) % 4].hits[num] != 3 ||
            players[(index() + 3) % 4].hits[num] != 3)
        ) {
          const teamA =
            players[index()].score + players[(index() + 2) % 4].score;
          const teamB =
            players[(index() + 1) % 4].score + players[(index() + 3) % 4].score;
          if (teamA - teamB >= 100) {
            console.log('overkill 100');
            setOverkill(true);
          } else {
            setPlayers(
              index(),
              'score',
              players[index()].score + num * (hits[num] - 3)
            );
          }
        }
        hits[num] = 3;
      }

      setPlayers(index(), { hits });
    }
    //console.log(players);

    setDardos(dardos() - 1);
    if (dardos() == 0) {
      setIndex((index() + 1) % 4);
      setDardos(3);
    }
  }

  return (
    <Page title="Dardos - Cricket Equipos" back={false}>
      {/* <p>
        This page is a home page in this boilerplate. You can use the links below to visit other
        pages with their own functionality.
      </p>
       <ul class="index-page__links">
        <For each={routes}>
          {(route) => (
            <Show when={route.title}>
              <li class="index-page__link-item">
                <Link class="index-page__link" href={route.path}>
                  <Show when={route.Icon}>
                    {(Icon) => (
                      <i class="index-page__link-icon">
                        <Dynamic component={Icon()}/>
                      </i>
                    )}
                  </Show>
                  {route.title}
                </Link>
              </li>
            </Show>
          )}
        </For>
      </ul> */}
      <table>
        <thead>
          <tr>
            <th></th>
            <th class={index() == 0 ? 'selected' : ''}>{players[0].name}</th>
            <th class={index() == 2 ? 'selected' : ''}>{players[2].name}</th>
            <th>-</th>
            <th class={index() == 1 ? 'selected' : ''}>{players[1].name}</th>
            <th class={index() == 3 ? 'selected' : ''}>{players[3].name}</th>
          </tr>
        </thead>
        <tbody>
          <For each={[20, 19, 18, 17, 16, 15, 25]}>
            {(number) => {
              return (
                <tr>
                  <td></td>
                  <td>{getSymbol(players[0].hits[number])}</td>
                  <td>{getSymbol(players[2].hits[number])}</td>
                  <td>{number == 25 ? 'Bull' : number}</td>
                  <td>{getSymbol(players[1].hits[number])}</td>
                  <td>{getSymbol(players[3].hits[number])}</td>
                </tr>
              );
            }}
          </For>
          <tr>
            <td>{players[0].score + players[2].score}</td>
            <td>{players[0].score}</td>
            <td>{players[2].score}</td>
            <td>Score</td>
            <td>{players[1].score}</td>
            <td>{players[3].score}</td>
            <td>{players[1].score + players[3].score}</td>
          </tr>
        </tbody>
      </table>

      <button onClick={() => hit(0)}>Miss</button>
      <br></br>
      <For each={[20, 19, 18, 17, 16, 15, 25]}>
        {(number) => {
          return (
            <button onClick={() => hit(number)}>
              {number == 25 ? 'Bull' : number}
            </button>
          );
        }}
      </For>
      <br></br>
      <For each={[20, 19, 18, 17, 16, 15, 25]}>
        {(number) => {
          return (
            <button onClick={() => hit(number, 2)}>
              {number == 25 ? 'DBull' : 'D' + number}
            </button>
          );
        }}
      </For>
      <br></br>
      <For each={[20, 19, 18, 17, 16, 15]}>
        {(number) => {
          return <button onClick={() => hit(number, 3)}>{'T' + number}</button>;
        }}
      </For>
      <p>
        Dardos: {dardos()} {overkill() ? 'Overkill' : ''}
      </p>
    </Page>
  );
};
function getSymbol(number: number) {
  return number == 1 ? '/' : number == 2 ? 'X' : number == 3 ? '%' : '';
}
