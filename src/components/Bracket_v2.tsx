import { TournamentV2Model } from '@/lib/db/tournament_v2';
import { Bracket, BracketGenerator } from 'react-tournament-bracket';
import { createGame } from '@/lib/game_v2';
import { GameComponentProps } from 'react-tournament-bracket/lib/components/Bracket';
import { GameExt, SideInfoExt } from 'react-tournament-bracket/lib/components/model';
import { RectClipped as RectClipped0 } from 'react-tournament-bracket/lib/components/Clipped';
import classNames from 'classnames';

const RectClipped = RectClipped0 as any;

function SLGame({ game: game0, x, y, homeOnTop }: GameComponentProps) {
  const game = game0 as GameExt;

  const {
    maps,
    sides,
  } = game;

  const top = sides.home;
  const bottom = sides.visitor;

  const isLastMatch = game.nextMatchId === null;

  const topWon = top.score?.score === 1;
  const bottomWon = bottom.score?.score === 1;

  const Side = ({ x, y, lost, side }: { x: number, y: number, lost: boolean, side: SideInfoExt }) => {
    return (
      <g>
        <RectClipped x={x} y={y} width={315} height={25}>
          <text x={x + 14} y={y + 17} textAnchor='middle' className={classNames('font-sl fill-white/80', lost && 'fill-half-white/30')}>
            {side.team?.id}
          </text>
          <text x={x + 28} y={y + 17} className={classNames('font-sl fill-yellow-500', lost && 'fill-yellow-500/30')}>
            {side.team?.clan}
          </text>
          <text x={x + 78} y={y + 17} wordSpacing={4} className={classNames('font-noto fill-white/80 text-sm', lost && 'fill-half-white/30')}>
            {side.team?.members?.join(' ')}
          </text>
        </RectClipped>
      </g>
    )
  };

  const width = 350;
  return (
    <svg width={width} height='82' viewBox='0 0 350 82' x={x} y={y}>

      <rect x='0' y='12' width={width} height='25' fill={topWon ? '#224076ff' : '#22407655'} />
      <rect x='0' y='37' width={width} height='25' fill={bottomWon ? '#602A35ff' : '#602A3555'} />
      <rect x='0' y='62' width={width} height='25' fill='#00000050' />

      <rect x={width - 40} y='12' width='40' height='25' fill='#10131c' />
      <rect x={width - 40} y='37' width='40' height='25' fill='#10131c' />

      <text x={width - 28} y='29' className={classNames('font-sl fill-white/80', (topWon && !bottomWon) && 'fill-green-400')}>
        {(topWon && !bottomWon) ? '승' : (!topWon && bottomWon) ? '패' : ''}
      </text>

      <text x={width - 28} y='54' className={classNames('font-sl fill-white/80', (bottomWon && !topWon) && 'fill-green-400')}>
        {(bottomWon && !topWon) ? '승' : (!bottomWon && topWon) ? '패' : ''}
      </text>

      {
        top ? (
          <Side x={0} y={12} side={top} lost={!topWon && bottomWon} />
        ) : null
      }

      {
        bottom ? (
          <Side x={0} y={37} side={bottom} lost={!bottomWon && topWon} />
        ) : null
      }

      {
        maps.length === 0 ? (
          <>
            <text x={width / 4} y='76' textAnchor='middle' width={width / 2} height='20' className='font-noto text-xs fill-white hover:fill-half-yellow cursor-pointer'>
              3라운드
            </text>
            <text x={width * 3 / 4} y='76' textAnchor='middle' width={width / 2} height='20' className='font-noto text-xs fill-white hover:fill-half-yellow cursor-pointer'>
              5라운드
            </text>
          </>
        ) : (
          <></>
        )
      }

      {
        (topWon || bottomWon) && !isLastMatch && (
          <rect x='0' y='12' width={width} height='75' className='fill-black/50 z-30 pointer-events-none' />
        )
      }
    </svg>
  )
}

export function BracketV2({
  model,
}: {
  model: TournamentV2Model;
  }) {
  return (
    <div className='relative w-fit'>
      <div>
        <Bracket game={createGame(model)} GameComponent={SLGame} gameDimensions={{ width: 350, height: 82 }} />
      </div>
    </div>
  );
}
