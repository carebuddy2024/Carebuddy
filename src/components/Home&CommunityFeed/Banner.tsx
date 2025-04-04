import React from 'react';
import styled from 'styled-components';
import Typewriter from 'typewriter-effect';

// 배너 요소 이미지
import BannerElementImage from '@assets/bannerElementImage.png';
import media from '@/utils/media';

type TextProps = {
  fontSize?: string;
  color?: string;
  fontWeight?: string;
};

const Banner: React.FC = () => (
  <StyledBanner>
    <Image src={BannerElementImage} alt="배너 이미지" />
    <TextContainer>
      <Row>
        <StyledText color="var(--color-green-main)">케어버디</StyledText>
        <StyledText>와 함께</StyledText>
      </Row>
      <Row>
        <StyledText>
          사랑하는 나의
          <TypeWriterWrapper>
            <Typewriter
              options={{
                strings: ['강아지와', '고양이와', '가족과'],
                autoStart: true,
                loop: true,
                delay: 150,
                deleteSpeed: 200,
              }}
            />
          </TypeWriterWrapper>
        </StyledText>
      </Row>
      <StyledText>건강하고 행복한 시간을 보내세요</StyledText>
      <StyledText
        color="var(--color-grey-1)"
        fontWeight="var(--font-weight-regular)"
        fontSize="var(--font-size-md-1)"
        className="subText"
      >
        꾸준한 질병 기록으로 아이의 건강을 지키고, 아이의 행복을 위한 정보를
        나눠보아요.
      </StyledText>
    </TextContainer>
  </StyledBanner>
);

export default Banner;

const StyledBanner = styled.div`
  position: relative;
  background-color: var(--color-green-sub-2);
  width: 100%;
  height: 100%;

  ${media.mobile} {
    > div * {
      font-size: var(--font-size-hd-2);

      &.subText {
        min-width: 300px;
        font-size: var(--font-size-sm-1);
        white-space: normal;
      }
    }
  }
`;

const Image = styled.img`
  position: absolute;
  left: 70%; // 부모 요소의 가로 중앙에 정렬
  bottom: 0; // 부모 요소의 하단에 정렬
  transform: translateX(-50%); // 중앙 정렬 보정
  width: 30vw;
  pointer-events: none;

  ${media.mobile} {
    left: 80%;
  }
`;

const TextContainer = styled.div`
  position: absolute;
  top: 36%;
  left: 32%; // 부모 요소의 가로 중앙에 정렬
  transform: translateX(-50%); // 중앙 정렬 보정
  width: 400px;
  pointer-events: none;

  ${media.mobile} {
    left: 24%;
    top: 39%;
    width: 30vw;
  }
`;

const Row = styled.div`
  display: flex;
`;

const TypeWriterWrapper = styled.div`
  padding-left: 10px;
`;

const StyledText = styled.div<TextProps>`
  display: flex;
  font-size: ${(props) => props.fontSize || 'var(--font-size-lg-2)'};
  font-weight: ${(props) => props.fontWeight || 'var(--font-weight-bold)'};
  padding: 8px 0;
  color: ${(props) => props && props.color};
`;
