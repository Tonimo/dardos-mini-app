import { createSignal, For, type Component } from 'solid-js';

import { Page } from '@/components/Page/Page.js';

import './IndexPage.css';
import { createStore } from 'solid-js/store';

export const IndexPage: Component = () => {
  const players1: { name: string; hits: number[]; score: number }[] = [];
  ['Jug1', 'Jug2', 'Jug3', 'Jug4'].forEach((name) => {
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
  const [ronda, setRonda] = createSignal(1);
  const [ganador, setGanador] = createSignal(0);

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
            //console.log('overkill 100');
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

      const teamA =
        players[index()].score + players[(index() + 2) % 4].score;
      const teamB =
        players[(index() + 1) % 4].score + players[(index() + 3) % 4].score;

      if (teamA >= teamB) {
        const hitsPartner = players[(index() + 2) % 4].hits.concat([]);

        if ((hits[20] == 3 && hits[19] == 3 && hits[18] == 3
          && hits[17] == 3 && hits[16] == 3 && hits[15] == 3
          && hits[20] == 3 && hits[25] == 3) || (hitsPartner[20] == 3
            && hitsPartner[19] == 3 && hitsPartner[18] == 3
            && hitsPartner[17] == 3 && hitsPartner[16] == 3
            && hitsPartner[15] == 3
            && hitsPartner[20] == 3 && hitsPartner[25] == 3)
        ) {
          setGanador(index() + 1)
        }
      }

      setPlayers(index(), { hits });
    }
    //console.log(players);

    setDardos(dardos() - 1);
    if (dardos() == 0) {
      setOverkill(false);
      setIndex((index() + 1) % 4);
      setDardos(3);
      if (index() % 4 == 0) {
        setRonda((prev => prev + 1))
      }
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
            <th class={index() == 1 ? 'selected2' : ''}>{players[1].name}</th>
            <th class={index() == 3 ? 'selected2' : ''}>{players[3].name}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <For each={[20, 19, 18, 17, 16, 15, 25]}>
            {(number) => {
              return (
                <tr>
                  <td></td>
                  <td class={index() == 0 ? 'selected' : ''} innerHTML={getSymbol(players[0].hits[number])}></td>
                  <td class={index() == 2 ? 'selected' : ''} innerHTML={getSymbol(players[2].hits[number])}></td>
                  <td>{number == 25 ? 'Centro' : number}</td>
                  <td class={index() == 1 ? 'selected2' : ''} innerHTML={getSymbol(players[1].hits[number])}></td>
                  <td class={index() == 3 ? 'selected2' : ''} innerHTML={getSymbol(players[3].hits[number])}></td>
                  <td></td>
                </tr>
              );
            }}
          </For>
          <tr>
            <td>Total</td>
            <td class={index() == 0 ? 'selected' : ''}></td>
            <td class={index() == 2 ? 'selected' : ''}></td>
            <td></td>
            <td class={index() == 1 ? 'selected2' : ''}></td>
            <td class={index() == 3 ? 'selected2' : ''}></td>
            <td>Total</td>
          </tr>
          <tr class='last'>
            <td>{players[0].score + players[2].score}</td>
            <td class={index() == 0 ? 'selected' : ''}>{players[0].score}</td>
            <td class={index() == 2 ? 'selected' : ''}>{players[2].score}</td>
            <td>Puntos</td>
            <td class={index() == 1 ? 'selected2' : ''}>{players[1].score}</td>
            <td class={index() == 3 ? 'selected2' : ''}>{players[3].score}</td>
            <td>{players[1].score + players[3].score}</td>
          </tr>
        </tbody>
      </table>

      <button class='red' style="width:100px" onClick={() => hit(0)}>Fallo</button>
      <button style="width:100px" onClick={() => hit(25)}>
        {'Centro'}
      </button><button style="width:100px" onClick={() => hit(25, 2)}>
        {'DCentro'}
      </button>
      <br></br>
      <For each={[20, 19, 18, 17, 16, 15]}>
        {(number) => {
          return (
            <button onClick={() => hit(number)}>
              {number}
            </button>
          );
        }}
      </For>
      <br></br>
      <For each={[20, 19, 18, 17, 16, 15]}>
        {(number) => {
          return (
            <button onClick={() => hit(number, 2)}>
              {'D' + number}
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
      <p>
        Ronda: {ronda()}
      </p>
      {ganador() != 0 && <p>
        Ganador: Jug{ganador()} y Jug{(ganador() + 1) % 4 + 1}
      </p>}
    </Page>
  );
};

function getSymbol(number: number) {
  return number == 1 ? '/' : number == 2 ? 'x' : number == 3 ? '&#9746;' : '';
}
