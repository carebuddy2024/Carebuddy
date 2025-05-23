/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

import type { PostData, CommunityData } from '@/types/index';

import Modal from '@/components/common/Modal';
import Select from '@/components/common/Select';
import PostCreate from '@/pages/PostCreate/index';
import Banner from '@/components/Home&CommunityFeed/Banner';
import NoPostsFound from '@/components/common/NoPostsFound';
import FeedBox from '@/components/Home&CommunityFeed/FeedBox';
import SidePanel from '@/components/Home&CommunityFeed/SidePanel';
import WriteButton from '@/components/Home&CommunityFeed/WirteButton';
import CommunityElement from '@/components/Home&CommunityFeed/CommunityElement';

import useGenerateOptions from '@/hooks/useGenerateOptions';
import usePostCreate from '@/hooks/usePostCreate';

import axiosInstance from '@/utils/axiosInstance';
import pickRandomItemFromArray from '@/utils/pickRandomItemFromArray';

import DefaultProfile from '@/assets/person.png';
import sortedByCreatedAt from '@/utils/sortedByCreatedAt';
import media from '@/utils/media';
import SkeletonFeedBox from '@/components/Home&CommunityFeed/SkeletonFeedBox';
import SkeletonSidePanel from '@/components/Home&CommunityFeed/SkeletonSidePanel';

const Home: React.FC = () => {
  // 상태 정의
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false); // 글 작성 모달 상태
  const [posts, setPosts] = useState<PostData[]>([]); // 전체 게시글
  const [selectedPosts, setSelectedPosts] = useState<PostData[]>([]); // 필터링된 게시글
  const [category, setCategory] = useState<number | string>(-1); // 선택된 카테고리
  const [community, setCommunity] = useState<string>('community'); // 선택된 커뮤니티
  const [isLoading, setIsLoading] = useState(false); // 데이터 로딩 상태
  const [error, setError] = useState<Error | null>(null);
  const [recommendedCommunities, setRecommendedCommunities] = useState<
    CommunityData[] | null
  >(null);

  const { categoryOptions, communityOptions } = useGenerateOptions();

  const [filteredCommunityOptions, setFilteredCommunityOptions] =
    useState(communityOptions);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/posts`);
      const postData: PostData[] = response.data.data;
      const sortedPosts: PostData[] = sortedByCreatedAt(postData);
      const filteredPosts = sortedPosts.filter(
        (post: PostData) => !post.deletedAt
      );

      setPosts(filteredPosts);
      setSelectedPosts(filteredPosts);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  // select 로직 - category 선택에 따라 community 옵션 필터링해서 보여줌
  useEffect(() => {
    if (category !== 'category') {
      const filteredCommunityOptions = communityOptions.filter(
        (community) => community.category === category
      );
      setFilteredCommunityOptions(filteredCommunityOptions);
    } else {
      setFilteredCommunityOptions(communityOptions);
    }
  }, [category]);

  // 카테고리 옵션 핸들러
  const handleCategoryOptions = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCategory(Number(event.target.value));
    setCommunity('community');
  };

  // 커뮤니티 옵션 핸들러
  const handleCommunityOptions = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedCommunity = event.target.value;
    setCommunity(selectedCommunity);
  };

  // select 게시글 조회
  useEffect(() => {
    if (category === -1) {
      // 카테고리도 선택 안된 경우
      setSelectedPosts(posts);
    } else if (category !== -1 && community === 'community') {
      // 카테고리 선택 O && 커뮤니티 선택 X
      const filteredPosts = posts.filter(
        (post) => post.communityId.category === category
      );
      setSelectedPosts(filteredPosts);
    } else {
      // 카테고리 선택 O && 커뮤니티 선택 O
      const filteredPosts = posts.filter(
        (post) =>
          post.communityId.category === category &&
          post.communityId._id === community
      );
      setSelectedPosts(filteredPosts);
    }
  }, [category, community]);

  // 추천 그룹 사이드바용 API(전체 그룹 조회)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get<{ data: CommunityData[] }>(
          'communities'
        );
        const communityArray = pickRandomItemFromArray(response.data.data, 3);
        setRecommendedCommunities(communityArray);
      } catch (error) {
        // 에러 처리 로직
      }
    };

    fetchData();
  }, []);

  const { handleFormDataChange, handlePostSubmit } = usePostCreate(() => {
    handleCloseWriteModal();
  });

  // 글 작성 모달 닫기 핸들러
  const handleCloseWriteModal = () => {
    setIsWriteModalOpen(false);
  };

  // 에러 처리
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <BannerDiv>
        <Banner />
      </BannerDiv>
      <ContentContainer>
        <FeedBoxContainer>
          <FeedOptionContainer>
            <SelectContainer>
              <P>분류: </P>
              <Select
                selectStyle="round"
                selectSize="sm"
                options={categoryOptions}
                onChange={handleCategoryOptions}
                // key={categoryOptions.values}
              />
              <Select
                selectStyle="round"
                options={filteredCommunityOptions} // 필터링된 옵션 사용
                onChange={handleCommunityOptions}
              />
            </SelectContainer>
            <WriteButton setIsWriteModalOpen={setIsWriteModalOpen} />
            {isWriteModalOpen && (
              <Modal
                title="글 작성하기"
                value="등록"
                component={
                  <PostCreate
                    postData={null}
                    onFormDataChange={handleFormDataChange}
                  />
                }
                onClose={handleCloseWriteModal}
                onHandleClick={handlePostSubmit}
              />
            )}
          </FeedOptionContainer>
          {/* {selectedPosts.length === 0 ? (
            isLoading ? (
              // 로딩 상태일 때 표시
              <FeedBoxContainer>
                <LoadingIndicatorWrapper>
                  <LoadingLogo />
                </LoadingIndicatorWrapper>
              </FeedBoxContainer>
            ) : (
              <NoPostsFound>해당하는 게시글이 없습니다.</NoPostsFound>
            )
          ) : ( */}
          {isLoading ? (
            // 스켈레톤 ui 5개
            Array.from({ length: 5 }).map((_, idx: number) => (
              // 고유값이 없으니 비활성
              // eslint-disable-next-line react/no-array-index-key
              <SkeletonFeedBox key={idx} />
            ))
          ) : selectedPosts.length === 0 ? (
            <NoPostsFound>해당하는 게시글이 없습니다.</NoPostsFound>
          ) : (
            selectedPosts.map((post) => (
              <FeedBox
                key={post._id}
                postId={post._id}
                title={post.title}
                content={post.content}
                uploadedDate={post.createdAt}
                nickname={post.userId ? post.userId.nickName : '알 수 없음'} // null 체크 추가
                profileSrc={
                  post.userId && post.userId.profileImage
                    ? post.userId.profileImage
                    : DefaultProfile
                }
                communityName={
                  post.communityId ? post.communityId.community : '알 수 없음' // 커뮤니티 이름 체크
                }
                communityCategory={
                  // eslint-disable-next-line no-nested-ternary
                  post.communityId && post.communityId.category !== undefined
                    ? post.communityId.category === 0
                      ? '강아지'
                      : '고양이'
                    : '알 수 없음' // 카테고리 체크
                }
                likeCount={post.likedUsers ? post.likedUsers.length : 0} // 좋아요 수 체크
                commentCount={post.commentId ? post.commentId.length : 0}
              />
            ))
          )}
        </FeedBoxContainer>
        <div>
          {isLoading ? (
            // 3개짜리 스켈레톤
            <SkeletonSidePanel />
          ) : (
            <SidePanel
              name="추천 커뮤니티"
              className="homePanel"
              elementArray={recommendedCommunities?.map((community) => (
                <CommunityElement
                  key={community._id}
                  communityId={community._id}
                  name={community.community}
                  introduction={community.introduction}
                />
              ))}
            />
          )}
        </div>
      </ContentContainer>
    </>
  );
};

export default Home;

const BannerDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  /* height: 55vh; */
  height: 400px;

  ${media.mobile} {
    height: 45vh;
    height: 300px;
  }
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 70% 20%;
  justify-content: space-between;
  width: 100%;
  margin-top: 250px;

  transition: margin 0.3s;

  ${media.mobile} {
    grid-template-columns: 100% 0;
    margin-top: 150px;
  }
`;

const FeedBoxContainer = styled.div`
  color: var(--color-grey-1);
  min-height: 30vh;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const FeedOptionContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;

  ${media.mobile} {
    flex-direction: column;
  }
`;

const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: var(--font-size-sm-1);

  & > * {
    margin-right: 10px;
  }

  ${media.mobile} {
    > select {
      padding: 4px 8px;
      max-width: 100px;
    }
  }
`;

const P = styled.p`
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-ft-1);
`;

// const spin = keyframes`
//   0% { transform: rotate(0deg); }
//   100% { transform: rotate(360deg); }
// `;

// const LoadingIndicatorWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   height: 200px; // 적당한 높이로 설정
//   text-align: center;

//   & > p {
//     margin-top: 15px;
//     font-size: 14px;
//     color: var(--color-grey-2);
//   }
// `;

// const LoadingLogo = styled.div`
//   border: 8px solid #f3f3f3;
//   border-top: 8px solid #6d987a;
//   border-radius: 50%;
//   width: 50px;
//   height: 50px;
//   animation: ${spin} 1s linear infinite;
// `;
