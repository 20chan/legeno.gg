import { TournamentV2Model } from '@/lib/db/tournament_v2';
import { Bracket, BracketGenerator } from 'react-tournament-bracket';
import { createGame, createThirdPlaceGame } from '@/lib/game_v2';
import { GameComponentProps } from 'react-tournament-bracket/lib/components/Bracket';
import { GameExt, SideInfoExt } from 'react-tournament-bracket/lib/components/model';
import { RectClipped as RectClipped0 } from 'react-tournament-bracket/lib/components/Clipped';
import winningPathLength from 'react-tournament-bracket/lib/util/winningPathLength';
import classNames from 'classnames';
import React from 'react';
import Image from 'next/image';
import { useTournamentContext } from './TournamentProvider';
import { mapInfos } from '@/lib/sl/map';

const RectClipped = RectClipped0 as any;
const Bracket0 = Bracket as any;

interface SLGameComponentProps extends GameComponentProps {
  customViewBox?: string;
  bottomText?: string;
  isThirdMatch?: boolean;
}

export function SLGame({ game: game0, x, y, customViewBox, bottomText, isThirdMatch }: SLGameComponentProps) {
  const game = game0 as GameExt;

  const { mapHandler, winHandler } = useTournamentContext();

  const [topWinHover, setTopWinHover] = React.useState(false);
  const [bottomWinHover, setBottomWinHover] = React.useState(false);

  const [topMapHover, setTopMapHover] = React.useState(false);
  const [bottomMapHover, setBottomMapHover] = React.useState(false);

  const {
    maps,
    sides,
    match,
  } = game;

  const top = sides.home;
  const bottom = sides.visitor;

  const isLastMatch = match.shape.nextMatchId === null;

  const topWon = top.score?.score === 1;
  const bottomWon = bottom.score?.score === 1;

  const Side = ({ x, y, lost, side }: { x: number, y: number, lost: boolean, side: SideInfoExt }) => {
    return (
      <g>
        <RectClipped x={x} y={y} width={315} height={25}>
          <text x={x + 14} y={y + 17} textAnchor='middle' className={classNames('font-sl', lost ? 'fill-half-white/30' : 'fill-white/80')}>
            {side.team?.id}
          </text>
          <text x={x + 28} y={y + 17} className={classNames('font-sl', lost ? 'fill-yellow-500/30' : 'fill-yellow-500')}>
            {side.team?.clan}
          </text>
          <text x={x + 78} y={y + 17} wordSpacing={4} className={classNames('font-noto text-sm', lost ? 'fill-half-white/30' : 'fill-white/80')}>
            {side.team?.members?.join(' ')}
          </text>
        </RectClipped>
      </g>
    )
  };

  const width = 350;
  return (
    <>
      <svg width={width} height='82' viewBox={customViewBox ?? '0 0 350 82'} x={x} y={y}>
        <rect x='0' y='12' width={width} height='25' fill={topWon ? '#224076ff' : '#22407655'} />
        <rect x='0' y='37' width={width} height='25' fill={bottomWon ? '#602A35ff' : '#602A3555'} />
        <rect x='0' y='62' width={width} height='25' fill='#00000050' />

        <rect x={width - 40} y='12' width='40' height='25' fill='#10131c'
          onPointerEnter={() => setTopWinHover(true)}
          onPointerLeave={() => setTopWinHover(false)}
          onClick={() => top.team && winHandler(match.id, parseInt(top.team.id), isThirdMatch ?? false)}
          className='cursor-pointer'
        />
        <rect x={width - 40} y='37' width='40' height='25' fill='#10131c'
          onPointerEnter={() => setBottomWinHover(true)}
          onPointerLeave={() => setBottomWinHover(false)}
          onClick={() => bottom.team && winHandler(match.id, parseInt(bottom.team.id), isThirdMatch ?? false)}
          className='cursor-pointer'
        />

        <text x={width - 28} y='29' className={classNames('pointer-events-none', !(topWon && !bottomWon) && !topWinHover && 'fill-white/80', (topWon && !bottomWon) && !topWinHover && 'fill-green-400', topWinHover && 'fill-half-yellow')}>
          {topWinHover ? '승?' : (topWon && !bottomWon) ? '승' : (!topWon && bottomWon) ? '패' : ''}
        </text>

        <text x={width - 28} y='54' className={classNames('pointer-events-none', !(bottomWon && !topWon) && !bottomWinHover && 'fill-white/80', (bottomWon && !topWon) && !bottomWinHover && 'fill-green-400', bottomWinHover && 'fill-half-yellow')}>
          {bottomWinHover ? '승?' : (bottomWon && !topWon) ? '승' : (!bottomWon && topWon) ? '패' : ''}
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
              <text x={width / 4} y='76' textAnchor='middle' width={width / 2} height='20'
                className='font-noto text-xs fill-white hover:fill-half-yellow cursor-pointer'
                onClick={() => mapHandler(match.id, 3, isThirdMatch ?? false)}
              >
                3라운드
              </text>
              <text x={width * 3 / 4} y='76' textAnchor='middle' width={width / 2} height='20'
                className='font-noto text-xs fill-white hover:fill-half-yellow cursor-pointer'
                onClick={() => mapHandler(match.id, 5, isThirdMatch ?? false)}
              >
                5라운드
              </text>
            </>
          ) : (
            <foreignObject x='0' y='62' width={width} height='20'>
              <div className='relative flex-1'>
                <div className='absolute inset-0 flex flex-row justify-stretch items-stretch overflow-clip'>
                  {maps && maps.map(x => (
                    <div key={x} className='relative flex-1'>
                      <Image src={mapInfos[x - 1]!.image} alt='' width={200} height={100} className={`absolute inset-0 h-auto filter opacity-30 ${maps.length === 3 ? '-translate-y-6' : '-translate-y-2 '}`} />
                    </div>
                  ))}
                </div>
                  <span className='flex flex-row justify-stretch'>
                  {maps.map(x => mapInfos[x - 1].name).map(x => (
                    <div key={x} className='flex-1 text-center'>
                      <span className='font-noto text-white text-xs align-top'>{x}</span>
                    </div>
                  ))}
                </span>
              </div>
            </foreignObject>
          )
        }

        {
          (topWon || bottomWon) && !isLastMatch && (
            <rect x='0' y='12' width={width} height='75' className='fill-black/50 z-30 pointer-events-none' />
          )
        }
      </svg>

      <foreignObject x={x} y={y + 81} width={width} height='20'>
        <div className='w-[350px] text-center text-sm text-white/60 mt-1'>
          {isLastMatch && (bottomText ?? '결승')}
        </div>
      </foreignObject>
    </>
  )
}

export function BracketV2({
  model,
}: {
  model: TournamentV2Model;
  }) {
  const game = createGame(model);
  const numRounds = winningPathLength(game);

  const gameDimensions = { width: 350, height: 82 };
  const svgDimensions = {
    width: numRounds * (gameDimensions.width + 24) + 40,
    height: gameDimensions.height * Math.pow(2, numRounds - 1) + 40,
  }

  return (
    <div className='relative w-fit'>
      <Bracket game={game} GameComponent={SLGame} gameDimensions={gameDimensions} />

      {
        model.options.thirdPlaceEnabled && (
          <div style={{
            position: 'absolute',
            top: svgDimensions.height / 2 + gameDimensions.height / 2 + 40,
            left: svgDimensions.width - 350 - 20,
          }}>
            <SLGame
              game={createThirdPlaceGame(model)}
              customViewBox='0 0 350 82'
              x={0}
              y={0}
              homeOnTop={true}
              bottomText='3/4위 결정전'
              isThirdMatch
            />
          </div>
        )
      }
    </div>
  );
}
