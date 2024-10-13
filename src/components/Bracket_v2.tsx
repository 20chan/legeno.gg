
import { MatchExt, ParticipantExt, createMatches } from '@/lib/bracket_v2';
import { TournamentV2Model } from '@/lib/db/tournament_v2';
import { mapInfos } from '@/lib/sl/map';
import {
  createTheme,
  MatchComponentProps,
  SingleEliminationBracket,
} from '@g-loot/react-tournament-brackets/dist/cjs';
import Image from 'next/image';
import styled, { css } from 'styled-components';
import { useTournamentContext } from './TournamentProvider';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  height: 100%;
  font-family: ${({ theme }) => theme.fontFamily};
`;
export const TopText = styled.p`
  color: ${({ theme }) => theme.textColor.dark};
  margin-bottom: 0.2rem;
  min-height: 1.25rem;
`;
export const BottomText = styled.p`
  color: ${({ theme }) => theme.textColor.dark};

  flex: 0 0 none;
  text-align: center;
  margin-top: 0.2rem;
  min-height: 1.25rem;
`;
export const StyledMatch = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  flex: 1 1 auto;
  justify-content: space-between;
`;

export const Team = styled.div`
height: 100%;
display: flex;
flex: 1 1 auto;
justify-content: inherit;
`;

interface ScoreProps {
  $won?: boolean;
}
export const Score = styled.div<ScoreProps>`
  display: flex;
  height: 100%;
  padding: 0 1rem;
  align-items: center;
  width: 13%;
  justify-content: center;
  background: ${({ theme, $won }: any) =>
    $won ? theme.score.background.wonColor : theme.score.background.lostColor};
  color: ${({ theme, $won }: any) =>
    $won ? theme.textColor.highlighted : theme.textColor.dark};
`;
interface SideProps {
  $won?: number;
  $hovered?: boolean;
  $top?: boolean;
  $empty?: boolean;
}
export const Side = styled.div<SideProps>`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 0 1rem;
  background: ${({ theme, $won, $top }: any) =>
    $top
      ? $won === 1 ? '#224076ff' : '#22407655'
      : $won === 1 ? '#602A35ff' : '#602A3555'
  };

  text-decoration-line: ${({ $won }: any) => $won === false ? 'line-through' : 'none'};

  border-right: 4px solid ${({ theme }) => theme.border.color};
  border-left: 4px solid ${({ theme }) => theme.border.color};
  border-top: 1px solid ${({ theme }) => theme.border.color};
  border-bottom: 1px solid ${({ theme }) => theme.border.color};

  transition: border-color 0.5s ${({ theme }) => theme.transitionTimingFunction};
  ${Team} {
    color: ${({ theme, $won }: any) =>
    $won === 1 ? theme.textColor.dark : theme.textColor.dark};
  }
  ${Score} {
    color: ${({ theme, $won }: any) =>
    $won === 1 ? theme.textColor.highlighted : theme.textColor.dark};
  }
  ${({ $hovered, theme, won }: any) =>
    $hovered &&
    css`
      border-color: ${theme.border.highlightedColor};
      ${Team} {
        color: ${theme.textColor.highlighted};
      }
      ${Score} {
        color: ${won
        ? theme.score.text.highlightedWonColor
        : theme.score.text.highlightedLostColor};
      }
    `}
`;
export const MapSide = styled.div<SideProps>`
  display: flex;
  height: ${({ empty }: any) => empty ? '80%' : '24px'};
  align-items: center;
  justify-content: space-between;
  padding: 0 0 0 0rem;
  background: ${({ theme, won }: any) =>
    won ? theme.matchBackground.wonColor : theme.matchBackground.lostColor};

  border-right: 4px solid ${({ theme }) => theme.border.color};
  border-left: 4px solid ${({ theme }) => theme.border.color};
  border-top: 1px solid ${({ theme }) => theme.border.color};
  border-bottom: 1px solid ${({ theme }) => theme.border.color};

  transition: border-color 0.5s ${({ theme }) => theme.transitionTimingFunction};
  ${Team} {
    color: ${({ theme, won }: any) =>
    won ? theme.textColor.highlighted : theme.textColor.dark};
  }
  ${Score} {
    color: ${({ theme, won }: any) =>
    won ? theme.textColor.highlighted : theme.textColor.dark};
  }
  ${({ hovered, theme, won }: any) =>
    hovered &&
    css`
      border-color: ${theme.border.highlightedColor};
      ${Team} {
        color: ${theme.textColor.highlighted};
      }
      ${Score} {
        color: ${won
        ? theme.score.text.highlightedWonColor
        : theme.score.text.highlightedLostColor};
      }
    `}
`;
interface LineProps {
  $highlighted?: boolean;
}
export const Line = styled.div<LineProps>`
  height: 1px;
  transition: border-color 0.5s ${({ theme }) => theme.smooth};

  border-width: 1px;
  border-style: solid;
  border-color: ${({ $highlighted, theme }: any) =>
    $highlighted ? theme.border.highlightedColor : theme.border.color};
`;

export const Anchor = styled.a`
  font-family: ${(props: any) =>
    props.font ? props.font : props.theme.fontFamily};
  font-weight: ${(props: any) => (props.bold ? '700' : '400')};
  color: ${(props: any) => props.theme.textColor.main};
  font-size: ${(props: any) => (props.size ? props.size : '1rem')};
  line-height: 1.375rem;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

function Match({
  bottomHovered,
  bottomParty,
  bottomText,
  bottomWon,
  match,
  onMatchClick,
  onMouseEnter,
  onMouseLeave,
  onPartyClick,
  topHovered,
  topParty,
  topText,
  topWon,
}: MatchComponentProps) {
  const { mapHandler, winHandler } = useTournamentContext();

  const top = topParty as ParticipantExt;
  const bottom = bottomParty as ParticipantExt;

  const { maps } = match as MatchExt;
  const mapsByName = maps?.map(x => mapInfos[x - 1]?.name) ?? [];
  const isLastDepth = match.nextMatchId === null;

  return (
    <Wrapper>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <TopText>{topText}</TopText>
        {(match.href || typeof onMatchClick === 'function') && (
          <Anchor
            href={match.href}
            onClick={event =>
              onMatchClick?.({ match, topWon, bottomWon, event })
            }
          >
            <TopText>Match Details</TopText>
          </Anchor>
        )}
      </div>
      <StyledMatch>

        {
          ((topWon || bottomWon) && !isLastDepth && !top.isThirdMatch) && (
            <div className='absolute inset-0 bg-black/50 z-30 pointer-events-none' />
          )
        }
        <Side
          onMouseEnter={() => onMouseEnter(topParty.id)}
          onMouseLeave={onMouseLeave}
          $won={topWon ? 1 : bottomWon ? 0 : -1}
          $top={true}
          $hovered={topHovered}
          onClick={() => onPartyClick?.(topParty, topWon)}
        >
          <Team>
            {
              top.clan ? (
                <>
                  <span className={`inline-block font-sl text-xl -ml-2 w-6 text-center text-half-white/80 ${(!topWon && bottomWon) && 'text-half-white/30'}`}>{top.id as number}</span>
                  <span className={`inline-block text-start font-clan text-xl ml-2 mr-1 w-14 text-yellow-500 ${(!topWon && bottomWon) && 'text-yellow-500/30'}`}>{top.clan}</span>
                  <span className='font-noto inline-block flex-1'>
                    <div className={`flex flex-row justify-start w-full gap-x-2.5 ${(!topWon && bottomWon) && 'text-half-white/30'}`}>
                      {top.members.map(x => <span key={x}>{x}</span>)}
                    </div>
                  </span>
                </>
              ) :
                <>
                  ...
                </>

            }
          </Team>
          <Score $won={topWon} className='cursor-pointer group' onClick={() => winHandler(top.depth, top.index, top.isThirdMatch)}>
            <span className='group-hover:inline hidden'>
              {topParty.id === undefined ? '' : topParty?.resultText === '패' ? '패' : '승?'}
            </span>
            <span className='group-hover:hidden inline z-40'>
              {topParty.resultText}
            </span>
          </Score>
        </Side>
        <Line $highlighted={(topHovered || bottomHovered)} />
        <Side
          onMouseEnter={() => onMouseEnter(bottomParty.id)}
          onMouseLeave={onMouseLeave}
          $won={bottomWon ? 1 : topWon ? 0 : -1}
          $top={false}
          $hovered={bottomHovered}
          onClick={() => onPartyClick?.(bottomParty, bottomWon)}
        >
          <Team>
            {
              bottom.clan ? (
                <>
                  <span className={`inline-block font-sl text-xl -ml-2 w-6 text-center text-half-white/80 ${(!bottomWon && topWon) && 'text-half-white/30'}`}>{bottom.id as number}</span>
                  <span className={`inline-block text-start font-clan text-xl ml-2 mr-1 w-14 text-yellow-500 ${(!bottomWon && topWon) && 'text-yellow-500/30'}`}>{bottom.clan}</span>
                  <span className='font-noto inline-block flex-1'>
                    <div className={`flex flex-row justify-start w-full gap-x-2.5 ${(!bottomWon && topWon) && 'text-half-white/30'}`}>
                      {bottom.members.map(x => <span key={x}>{x}</span>)}
                    </div>
                  </span>
                </>
              ) :
                <>
                  ...
                </>
            }
          </Team>
          <Score $won={bottomWon} className='cursor-pointer group' onClick={() => winHandler(bottom.depth, bottom.index, bottom.isThirdMatch)}>
            <span className='group-hover:inline hidden'>
              {bottom.id === undefined ? '' : bottom.resultText === '패' ? '패' : '승?'}
            </span>
            <span className='group-hover:hidden inline z-40'>
              {bottomParty?.resultText}
            </span>
          </Score>
        </Side>
        <MapSide $empty={!maps}>
          <Team>
            {
              (maps && maps.length !== 0) ? (
                <div className='relative flex-1'>
                  <div className='absolute inset-0 flex flex-row justify-stretch items-stretch overflow-clip'>
                    {maps && maps.map(x => (
                      <div key={x} className='relative flex-1'>
                        <Image src={mapInfos[x - 1]!.image} alt='' width={200} height={100} className={`absolute inset-0 h-auto filter opacity-30 ${maps.length === 3 ? '-translate-y-6' : '-translate-y-2 '}`} />
                      </div>
                    ))}
                  </div>
                  <span className='flex flex-row justify-stretch'>
                    {mapsByName.map(x => (
                      <div key={x} className='flex-1 text-center'>
                        <span className='font-noto text-white text-sm'>{x}</span>
                      </div>
                    ))}
                  </span>
                </div>
              ) : topParty.id !== undefined ? (
                <div className='flex flex-row justify-stretch items-stretch w-full font-noto text-sm'>
                  <div className='flex-1 text-center cursor-pointer hover:text-half-yellow' onClick={() => mapHandler(top.depth, top.index, 3, top.isThirdMatch)}>
                    3라운드
                  </div>
                  <div className='flex-1 text-center cursor-pointer hover:text-half-yellow' onClick={() => mapHandler(top.depth, top.index, 5, top.isThirdMatch)}>
                    5라운드
                  </div>
                </div>
              ) : (
                <br />
              )
            }
          </Team>
        </MapSide>
      </StyledMatch>
      <BottomText>{bottomText ?? ' '}</BottomText>
    </Wrapper>
  );
}

const theme = createTheme({
  textColor: { main: 'var(--yellow)', highlighted: '#20c997', dark: 'var(--light)' },
});

export function BracketV2({
  model,
}: {
  model: TournamentV2Model;
}) {
  return (
    <div className='-mt-10 relative w-fit'>
      <SingleEliminationBracket
        matches={createMatches(model)}
        matchComponent={Match}
        theme={theme}
        options={{
          style: {
            width: 400,
            boxHeight: 120,
            connectorColor: '#6c757d',
            connectorColorHighlight: '#20c997',
            spaceBetweenRows: -10,
            roundHeader: {
              isShown: false,
            },
          }
        }}
      />
    </div>
  );
}
