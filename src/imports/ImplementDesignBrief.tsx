import clsx from "clsx";
import imgImg from "figma:asset/ed100bea7ae2d722ed9ca9861ac5259bba87b56a.png";
import imgImg1 from "figma:asset/9c1c87ac35474d76b30a410f0d94ba826bb9bc5c.png";
import imgImg2 from "figma:asset/aa459a235a9fe1395fc563a9563ba7e94403f43c.png";
import imgImg3 from "figma:asset/08665c3ef2f9415de5f1df2401b1aa23aa68860c.png";
import imgImg4 from "figma:asset/dcaab5a2c2266f276bddacdee19af8df2f8fe506.png";
import imgImg5 from "figma:asset/57e4988059aed1ce0d25fceab0f61b061e3ff1d5.png";
type SpanProps = {
  additionalClassNames?: string;
};

function Span({ children, additionalClassNames = "" }: React.PropsWithChildren<SpanProps>) {
  return (
    <div className={clsx("relative shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">{children}</div>
    </div>
  );
}
type Container12Props = {
  additionalClassNames?: string;
};

function Container12({ children, additionalClassNames = "" }: React.PropsWithChildren<Container12Props>) {
  return (
    <div className={clsx("absolute bg-[#d4cbb8] h-[377.5px] opacity-15", additionalClassNames)}>
      <div className="content-stretch flex flex-col items-start overflow-clip p-[3px] relative rounded-[inherit] size-full">{children}</div>
      <div aria-hidden="true" className="absolute border-3 border-[#8b7e6a] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Wrapper5({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full">
      <p className="absolute font-['UnifrakturCook:Bold',sans-serif] leading-[20px] left-0 not-italic text-[#2b2820] text-[14px] top-0 tracking-[0.28px]">{children}</p>
    </div>
  );
}
type Wrapper4Props = {
  additionalClassNames?: string;
};

function Wrapper4({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper4Props>) {
  return (
    <div className={clsx("bg-[#d4cbb8] relative shrink-0 w-full", additionalClassNames)}>
      <div className="content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">{children}</div>
    </div>
  );
}
type Wrapper3Props = {
  additionalClassNames?: string;
};

function Wrapper3({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper3Props>) {
  return (
    <div className={clsx("relative shrink-0 w-full", additionalClassNames)}>
      <div className="content-stretch flex flex-col items-start pt-[12px] px-[12px] relative size-full">{children}</div>
    </div>
  );
}
type Wrapper2Props = {
  additionalClassNames?: string;
};

function Wrapper2({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper2Props>) {
  return (
    <div className={additionalClassNames}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">{children}</div>
    </div>
  );
}
type Wrapper1Props = {
  additionalClassNames?: string;
};

function Wrapper1({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper1Props>) {
  return <Wrapper2 additionalClassNames={clsx("h-[16px] relative", additionalClassNames)}>{children}</Wrapper2>;
}
type WrapperProps = {
  additionalClassNames?: string;
};

function Wrapper({ children, additionalClassNames = "" }: React.PropsWithChildren<WrapperProps>) {
  return (
    <div className={clsx("relative shrink-0 w-full", additionalClassNames)}>
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[2px] relative size-full">{children}</div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#8b7e6a] border-solid inset-0 pointer-events-none" />
    </div>
  );
}
type ContainerText1Props = {
  text: string;
  additionalClassNames?: string;
};

function ContainerText1({ text, additionalClassNames = "" }: ContainerText1Props) {
  return (
    <Wrapper2 additionalClassNames={clsx("h-[16px] relative shrink-0", additionalClassNames)}>
      <p className="font-['IBM_Plex_Mono:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-[rgba(232,225,211,0.4)] tracking-[0.6px]">{text}</p>
    </Wrapper2>
  );
}
type TextProps = {
  text: string;
};

function Text({ text }: TextProps) {
  return (
    <div className="h-[20px] relative shrink-0 w-full">
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[20px] left-0 not-italic text-[14px] text-[rgba(232,225,211,0.8)] top-0 tracking-[0.7px]">{text}</p>
    </div>
  );
}
type HText1Props = {
  text: string;
};

function HText1({ text }: HText1Props) {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full">
      <p className="flex-[1_0_0] font-['IBM_Plex_Mono:Medium',sans-serif] leading-[16px] min-h-px min-w-px not-italic relative text-[12px] text-[rgba(232,225,211,0.5)] tracking-[0.6px] whitespace-pre-wrap">{text}</p>
    </div>
  );
}

function Container11() {
  return (
    <Wrapper3 additionalClassNames="bg-[#d4cbb8] h-[44px]">
      <HText text="Eclipse Ritual" />
    </Wrapper3>
  );
}

function Container10() {
  return (
    <Wrapper4 additionalClassNames="h-[151.563px]">
      <Wrapper additionalClassNames="h-[135.563px]">
        <div className="h-[131.563px] relative shrink-0 w-full">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg5} />
        </div>
      </Wrapper>
    </Wrapper4>
  );
}

function Container9() {
  return (
    <Wrapper3 additionalClassNames="bg-[#d4cbb8] h-[44px]">
      <HText text="Void Walker" />
    </Wrapper3>
  );
}

function Container8() {
  return (
    <Wrapper4 additionalClassNames="h-[151.563px]">
      <Wrapper additionalClassNames="h-[135.563px]">
        <div className="h-[131.563px] relative shrink-0 w-full">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg4} />
        </div>
      </Wrapper>
    </Wrapper4>
  );
}

function Container7() {
  return (
    <Wrapper3 additionalClassNames="bg-[#d4cbb8] h-[44px]">
      <HText text="Severance Hymn" />
    </Wrapper3>
  );
}

function Container6() {
  return (
    <Wrapper4 additionalClassNames="h-[299.5px]">
      <Wrapper additionalClassNames="h-[283.5px]">
        <div className="h-[279.5px] relative shrink-0 w-full">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg3} />
        </div>
      </Wrapper>
    </Wrapper4>
  );
}

function Container5() {
  return (
    <Wrapper3 additionalClassNames="bg-[#d4cbb8] h-[44px]">
      <HText text="Ritual Chant" />
    </Wrapper3>
  );
}

function Container4() {
  return (
    <Wrapper4 additionalClassNames="h-[151.563px]">
      <Wrapper additionalClassNames="h-[135.563px]">
        <div className="h-[131.563px] relative shrink-0 w-full">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg2} />
        </div>
      </Wrapper>
    </Wrapper4>
  );
}

function Container3() {
  return (
    <Wrapper3 additionalClassNames="bg-[#d4cbb8] h-[44px]">
      <HText text="Mounting Mountain Cemetery" />
    </Wrapper3>
  );
}
type HTextProps = {
  text: string;
};

function HText({ text }: HTextProps) {
  return <Wrapper5>{text}</Wrapper5>;
}

function Container2() {
  return (
    <Wrapper4 additionalClassNames="h-[151.563px]">
      <Wrapper additionalClassNames="h-[135.563px]">
        <div className="h-[131.563px] relative shrink-0 w-full">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg1} />
        </div>
      </Wrapper>
    </Wrapper4>
  );
}

function Container1() {
  return (
    <Wrapper3 additionalClassNames="bg-[#d4cbb8] h-[44px]">
      <Wrapper5>{`Moth's Lament`}</Wrapper5>
    </Wrapper3>
  );
}

function Container() {
  return (
    <Wrapper4 additionalClassNames="h-[299.5px]">
      <Wrapper additionalClassNames="h-[283.5px]">
        <div className="h-[279.5px] relative shrink-0 w-full">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg} />
        </div>
      </Wrapper>
    </Wrapper4>
  );
}
type ContainerTextProps = {
  text: string;
  additionalClassNames?: string;
};

function ContainerText({ text, additionalClassNames = "" }: ContainerTextProps) {
  return (
    <div className={clsx("absolute h-[15px] top-0", additionalClassNames)}>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15px] left-0 not-italic text-[10px] text-[rgba(26,30,255,0.6)] top-0 tracking-[0.5px]">{text}</p>
    </div>
  );
}

export default function ImplementDesignBrief() {
  return (
    <div className="bg-white relative size-full" data-name="Implement Design Brief">
      <div className="absolute bg-[#e8e1d3] content-stretch flex flex-col h-[1763px] items-start left-0 overflow-clip top-0 w-[1322px]" data-name="Body">
        <div className="bg-[#e8e1d3] h-[1763.141px] relative shrink-0 w-full" data-name="div">
          <div className="absolute h-[1426.141px] left-0 top-0 w-[1322px]" data-name="Container">
            <div className="absolute bg-[#f0f1f6] border-2 border-[#8b7e6a] border-solid h-[442.141px] left-[64px] top-[856px] w-[1194px]" data-name="motion.div">
              <div className="absolute content-stretch flex flex-col gap-[8px] h-[54.328px] items-start left-[32px] pb-px top-[32px] w-[1126px]" data-name="div">
                <div aria-hidden="true" className="absolute border-[rgba(26,30,255,0.3)] border-b border-solid inset-0 pointer-events-none" />
                <div className="content-stretch flex h-[16px] items-center justify-between relative shrink-0 w-full" data-name="Container">
                  <Wrapper1 additionalClassNames="shrink-0 w-[171.609px]">
                    <p className="font-['IBM_Plex_Mono:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-[rgba(26,30,255,0.7)] tracking-[0.6px]">EXIT.WAVE DEMO ARCHIVE</p>
                  </Wrapper1>
                  <Wrapper1 additionalClassNames="shrink-0 w-[54.609px]">
                    <p className="font-['IBM_Plex_Mono:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-[rgba(26,30,255,0.5)] tracking-[0.6px]">v0.14.0</p>
                  </Wrapper1>
                </div>
                <div className="content-stretch flex h-[13.328px] items-start relative shrink-0 w-full" data-name="Container">
                  <p className="flex-[1_0_0] font-['IBM_Plex_Mono:Regular',sans-serif] leading-[13.333px] min-h-px min-w-px not-italic relative text-[10px] text-[rgba(26,30,255,0.5)] tracking-[0.6px] whitespace-pre-wrap">4 ENTRIES FOUND</p>
                </div>
              </div>
              <div className="absolute border-[rgba(26,30,255,0.2)] border-b border-solid h-[24px] left-[32px] top-[110.33px] w-[1126px]" data-name="div">
                <ContainerText text="#" additionalClassNames="left-0 w-[79.156px]" />
                <ContainerText text="TRACK_NAME" additionalClassNames="left-[95.16px] w-[364.672px]" />
                <ContainerText text="STATUS" additionalClassNames="left-[475.83px] w-[174.328px]" />
                <ContainerText text="BPM" additionalClassNames="left-[666.16px] w-[79.172px]" />
                <ContainerText text="STEMS" additionalClassNames="left-[761.33px] w-[174.328px]" />
                <div className="absolute h-[15px] left-[951.66px] top-0 w-[174.328px]" data-name="Container">
                  <p className="-translate-x-full absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15px] left-[174.33px] not-italic text-[10px] text-[rgba(26,30,255,0.6)] text-right top-0 tracking-[0.5px]">ACTION</p>
                </div>
              </div>
              <div className="absolute h-[205.313px] left-[32px] top-[146.33px] w-[1126px]" data-name="div" />
              <div className="absolute border-[rgba(26,30,255,0.2)] border-solid border-t h-[30.5px] left-[32px] top-[375.64px] w-[1126px]" data-name="div">
                <div className="absolute content-stretch flex h-[11px] items-start left-0 opacity-50 top-[17px] w-[5.406px]" data-name="span">
                  <p className="font-['IBM_Plex_Mono:Regular','Noto_Sans_Math:Regular',sans-serif] leading-[13.5px] not-italic relative shrink-0 text-[9px] text-[rgba(26,30,255,0.4)] tracking-[0.45px]">█</p>
                </div>
                <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[13.5px] left-[5.41px] not-italic text-[9px] text-[rgba(26,30,255,0.4)] top-[16px] tracking-[0.45px]">{` END_OF_TRANSMISSION`}</p>
              </div>
            </div>
            <div className="absolute h-[728px] left-0 overflow-clip top-0 w-[1322px]" data-name="section">
              <div className="absolute h-[728px] left-[-128px] top-0 w-[1578px]" data-name="div">
                <Container12 additionalClassNames="left-0 top-0 w-[526px]">
                  <div className="bg-[#8b7e6a] h-[16px] shrink-0 w-full" data-name="Container" />
                  <Container />
                  <Container1 />
                  <div className="bg-[#8b7e6a] h-[12px] shrink-0 w-full" data-name="Container" />
                </Container12>
                <Container12 additionalClassNames="left-[526px] top-0 w-[263px]">
                  <div className="bg-[#8b7e6a] h-[16px] shrink-0 w-full" data-name="Container" />
                  <Container2 />
                  <Container3 />
                  <div className="bg-[#8b7e6a] h-[12px] shrink-0 w-full" data-name="Container" />
                </Container12>
                <Container12 additionalClassNames="left-[789px] top-0 w-[263px]">
                  <div className="bg-[#8b7e6a] h-[16px] shrink-0 w-full" data-name="Container" />
                  <Container4 />
                  <Container5 />
                  <div className="bg-[#8b7e6a] h-[12px] shrink-0 w-full" data-name="Container" />
                </Container12>
                <Container12 additionalClassNames="left-[1052px] top-0 w-[526px]">
                  <div className="bg-[#8b7e6a] h-[16px] shrink-0 w-full" data-name="Container" />
                  <Container6 />
                  <Container7 />
                  <div className="bg-[#8b7e6a] h-[12px] shrink-0 w-full" data-name="Container" />
                </Container12>
                <Container12 additionalClassNames="left-0 top-[377.5px] w-[263px]">
                  <div className="bg-[#8b7e6a] h-[16px] shrink-0 w-full" data-name="Container" />
                  <Container8 />
                  <Container9 />
                  <div className="bg-[#8b7e6a] h-[12px] shrink-0 w-full" data-name="Container" />
                </Container12>
                <Container12 additionalClassNames="left-[263px] top-[377.5px] w-[263px]">
                  <div className="bg-[#8b7e6a] h-[16px] shrink-0 w-full" data-name="Container" />
                  <Container10 />
                  <Container11 />
                  <div className="bg-[#8b7e6a] h-[12px] shrink-0 w-full" data-name="Container" />
                </Container12>
                <Container12 additionalClassNames="left-[526px] top-[377.5px] w-[526px]">
                  <div className="bg-[#8b7e6a] h-[16px] shrink-0 w-full" data-name="Container" />
                  <Container />
                  <Container1 />
                  <div className="bg-[#8b7e6a] h-[12px] shrink-0 w-full" data-name="Container" />
                </Container12>
                <Container12 additionalClassNames="left-[1052px] top-[377.5px] w-[263px]">
                  <div className="bg-[#8b7e6a] h-[16px] shrink-0 w-full" data-name="Container" />
                  <Container2 />
                  <Container3 />
                  <div className="bg-[#8b7e6a] h-[12px] shrink-0 w-full" data-name="Container" />
                </Container12>
                <Container12 additionalClassNames="left-[1315px] top-[377.5px] w-[263px]">
                  <div className="bg-[#8b7e6a] h-[16px] shrink-0 w-full" data-name="Container" />
                  <Container4 />
                  <Container5 />
                  <div className="bg-[#8b7e6a] h-[12px] shrink-0 w-full" data-name="Container" />
                </Container12>
                <Container12 additionalClassNames="left-0 top-[755px] w-[526px]">
                  <div className="bg-[#8b7e6a] h-[16px] shrink-0 w-full" data-name="Container" />
                  <Container6 />
                  <Container7 />
                  <div className="bg-[#8b7e6a] h-[12px] shrink-0 w-full" data-name="Container" />
                </Container12>
                <Container12 additionalClassNames="left-[526px] top-[755px] w-[263px]">
                  <div className="bg-[#8b7e6a] h-[16px] shrink-0 w-full" data-name="Container" />
                  <Container8 />
                  <Container9 />
                  <div className="bg-[#8b7e6a] h-[12px] shrink-0 w-full" data-name="Container" />
                </Container12>
                <Container12 additionalClassNames="left-[789px] top-[755px] w-[263px]">
                  <div className="bg-[#8b7e6a] h-[16px] shrink-0 w-full" data-name="Container" />
                  <Container10 />
                  <Container11 />
                  <div className="bg-[#8b7e6a] h-[12px] shrink-0 w-full" data-name="Container" />
                </Container12>
                <Container12 additionalClassNames="left-[1052px] top-[755px] w-[526px]">
                  <div className="bg-[#8b7e6a] h-[16px] shrink-0 w-full" data-name="Container" />
                  <Container />
                  <Container1 />
                  <div className="bg-[#8b7e6a] h-[12px] shrink-0 w-full" data-name="Container" />
                </Container12>
                <Container12 additionalClassNames="left-0 top-[1132.5px] w-[263px]">
                  <div className="bg-[#8b7e6a] h-[16px] shrink-0 w-full" data-name="Container" />
                  <Container2 />
                  <Container3 />
                  <div className="bg-[#8b7e6a] h-[12px] shrink-0 w-full" data-name="Container" />
                </Container12>
                <Container12 additionalClassNames="left-[263px] top-[1132.5px] w-[263px]">
                  <div className="bg-[#8b7e6a] h-[16px] shrink-0 w-full" data-name="Container" />
                  <Container4 />
                  <Container5 />
                  <div className="bg-[#8b7e6a] h-[12px] shrink-0 w-full" data-name="Container" />
                </Container12>
                <Container12 additionalClassNames="left-[526px] top-[1132.5px] w-[526px]">
                  <div className="bg-[#8b7e6a] h-[16px] shrink-0 w-full" data-name="Container" />
                  <Container6 />
                  <Container7 />
                  <div className="bg-[#8b7e6a] h-[12px] shrink-0 w-full" data-name="Container" />
                </Container12>
                <Container12 additionalClassNames="left-[1052px] top-[1132.5px] w-[263px]">
                  <div className="bg-[#8b7e6a] h-[16px] shrink-0 w-full" data-name="Container" />
                  <Container8 />
                  <Container9 />
                  <div className="bg-[#8b7e6a] h-[12px] shrink-0 w-full" data-name="Container" />
                </Container12>
                <Container12 additionalClassNames="left-[1315px] top-[1132.5px] w-[263px]">
                  <div className="bg-[#8b7e6a] h-[16px] shrink-0 w-full" data-name="Container" />
                  <Container10 />
                  <Container11 />
                  <div className="bg-[#8b7e6a] h-[12px] shrink-0 w-full" data-name="Container" />
                </Container12>
              </div>
              <div className="absolute h-[616px] left-[32px] top-[112px] w-[1258px]" data-name="div">
                <div className="absolute bg-[#f0f1f6] h-[582.625px] left-[293px] top-[8.69px] w-[672px]" data-name="Container">
                  <div className="content-stretch flex flex-col items-start overflow-clip p-[3px] relative rounded-[inherit] size-full">
                    <Wrapper3 additionalClassNames="h-[385.125px]">
                      <div className="h-[361.125px] relative shrink-0 w-full" data-name="Container">
                        <div className="overflow-clip relative rounded-[inherit] size-full">
                          <div className="absolute h-[357.125px] left-[2px] top-[2px] w-[638px]" data-name="img">
                            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg} />
                          </div>
                          <div className="absolute bg-[rgba(26,24,22,0.6)] content-stretch flex h-[357.125px] items-end justify-center left-[2px] pb-[24px] top-[2px] w-[638px]" data-name="Container">
                            <div className="bg-[rgba(232,225,211,0.8)] relative rounded-[4px] shrink-0 size-[80px]" data-name="button">
                              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pl-[4px] relative size-full">
                                <div className="relative shrink-0 size-[32px]" data-name="Play">
                                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                                    <g id="Play">
                                      <path d="M8 4L26.6667 16L8 28V4Z" fill="var(--fill-0, #1A1EFF)" id="Vector" />
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div aria-hidden="true" className="absolute border-2 border-[#8b7e6a] border-solid inset-0 pointer-events-none" />
                      </div>
                    </Wrapper3>
                    <div className="h-[151.5px] relative shrink-0 w-full" data-name="Container">
                      <div className="content-stretch flex flex-col gap-[16px] items-start pt-[24px] px-[24px] relative size-full">
                        <div className="content-stretch flex flex-col h-[71.5px] items-start pb-[2px] relative shrink-0 w-full" data-name="Container">
                          <div aria-hidden="true" className="absolute border-[rgba(139,126,106,0.4)] border-b-2 border-solid inset-0 pointer-events-none" />
                          <div className="content-stretch flex h-[57.5px] items-center justify-between relative shrink-0 w-full" data-name="Container">
                            <div className="flex-[1_0_0] h-[57.5px] min-h-px min-w-px relative" data-name="Container">
                              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
                                <div className="h-[37.5px] relative shrink-0 w-full" data-name="h2">
                                  <p className="absolute font-['Korner_Display:Regular',sans-serif] leading-none left-0 not-italic text-[#1a1eff] text-[28px] top-0">{`Moth's Lament`}</p>
                                </div>
                                <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
                                  <p className="flex-[1_0_0] font-['IBM_Plex_Mono:Regular',sans-serif] leading-[16px] min-h-px min-w-px not-italic relative text-[12px] text-[rgba(43,40,32,0.5)] tracking-[0.6px] whitespace-pre-wrap">NIGHT HYMNS</p>
                                </div>
                              </div>
                            </div>
                            <div className="h-[41.5px] relative shrink-0 w-[46.813px]" data-name="Container">
                              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
                                <div className="h-[28px] relative shrink-0 w-full" data-name="Container">
                                  <p className="-translate-x-full absolute font-['IBM_Plex_Mono:Medium',sans-serif] leading-[28px] left-[47px] not-italic text-[#1a1816] text-[18px] text-right top-[-1px] tracking-[0.9px]">4:32</p>
                                </div>
                                <div className="h-[13.5px] relative shrink-0 w-full" data-name="Container">
                                  <p className="-translate-x-full absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[13.5px] left-[47px] not-italic text-[9px] text-[rgba(43,40,32,0.4)] text-right top-0 tracking-[0.45px]">DURATION</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="content-stretch flex h-[16px] items-center justify-between relative shrink-0 w-full" data-name="Container">
                          <Wrapper1 additionalClassNames="shrink-0 w-[88.609px]">
                            <p className="font-['IBM_Plex_Mono:Regular','Noto_Sans_Symbols2:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-[rgba(43,40,32,0.4)] tracking-[0.6px]">◆ EXIT.WAVE</p>
                          </Wrapper1>
                          <Wrapper1 additionalClassNames="shrink-0 w-[46.813px]">
                            <p className="font-['IBM_Plex_Mono:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-[rgba(43,40,32,0.4)] tracking-[0.6px]">MMXXVI</p>
                          </Wrapper1>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div aria-hidden="true" className="absolute border-3 border-[#8b7e6a] border-solid inset-0 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bg-[#2b2820] content-stretch flex flex-col h-[337px] items-start left-0 pt-[4px] px-[21px] top-[1426.14px] w-[1322px]" data-name="footer">
            <div aria-hidden="true" className="absolute border-[#8b7e6a] border-solid border-t-4 inset-0 pointer-events-none" />
            <div className="h-[333px] relative shrink-0 w-full" data-name="div">
              <div className="content-stretch flex flex-col gap-[48px] items-start pt-[64px] px-[32px] relative size-full">
                <div className="h-[108px] relative shrink-0 w-full" data-name="Container">
                  <div className="absolute content-stretch flex flex-col gap-[16px] h-[108px] items-start left-0 top-0 w-[373.328px]" data-name="Container">
                    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
                      <p className="absolute font-['Korner_Display:Regular',sans-serif] leading-[36px] left-0 not-italic text-[#e8e1d3] text-[30px] top-0 tracking-[0.6px]">EXIT.WAVE</p>
                    </div>
                    <div className="h-[45.5px] relative shrink-0 w-full" data-name="p">
                      <p className="absolute font-['Cinzel:Regular',sans-serif] font-normal leading-[22.75px] left-0 text-[14px] text-[rgba(232,225,211,0.7)] top-[-1px] tracking-[0.42px] w-[355px] whitespace-pre-wrap">A witch rock collective merging medieval heraldry with corporate occult aesthetics.</p>
                    </div>
                  </div>
                  <div className="absolute content-stretch flex flex-col gap-[16px] h-[108px] items-start left-[421.33px] top-0 w-[373.328px]" data-name="Container">
                    <HText1 text="NAVIGATION" />
                    <div className="content-stretch flex flex-col gap-[8px] h-[76px] items-start relative shrink-0 w-full" data-name="nav">
                      <Text text="The Signal" />
                      <Text text="The Coven" />
                      <Text text="Ritual Contact" />
                    </div>
                  </div>
                  <div className="absolute content-stretch flex flex-col gap-[16px] h-[108px] items-start left-[842.66px] top-0 w-[373.344px]" data-name="Container">
                    <HText1 text="TRANSMISSION CHANNELS" />
                    <div className="content-stretch flex flex-col gap-[8px] h-[76px] items-start relative shrink-0 w-full" data-name="Container">
                      <Text text="Tidal" />
                      <Text text="Instagram" />
                      <Text text="SoundCloud" />
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex h-[49px] items-center justify-between pt-px relative shrink-0 w-full" data-name="Container">
                  <div aria-hidden="true" className="absolute border-[rgba(139,126,106,0.3)] border-solid border-t inset-0 pointer-events-none" />
                  <ContainerText1 text="© MMXXVI EXIT.WAVE · HARLEM, NY × WESTERN MASSACHUSETTS" additionalClassNames="w-[429px]" />
                  <ContainerText1 text="v0.14.0" additionalClassNames="w-[54.609px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bg-[rgba(61,54,41,0.9)] content-stretch flex gap-[12px] h-[52px] items-center left-[506.14px] px-[26px] py-[2px] top-[16px] w-[309.719px]" data-name="Link">
        <div aria-hidden="true" className="absolute border-2 border-[#8b7e6a] border-solid inset-0 pointer-events-none" />
        <Span additionalClassNames="h-[15px] w-[45.5px]">
          <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15px] left-0 not-italic text-[#c9a353] text-[10px] top-0 tracking-[0.5px]">v0.14.0</p>
        </Span>
        <Wrapper1 additionalClassNames="flex-[1_0_0] min-h-px min-w-px">
          <p className="font-['IBM_Plex_Mono:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#e8e1d3] text-[12px] tracking-[0.6px]">Ritual Chant — NEW DEMO</p>
        </Wrapper1>
        <Span additionalClassNames="h-[24px] w-[8.797px]">
          <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#c9a353] text-[16px] top-px">→</p>
        </Span>
      </div>
    </div>
  );
}