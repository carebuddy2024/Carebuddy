import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import defaultImg from '@/assets/person.png';
import Button from '@/components/common/Button';
import TextArea from '@/components/common/TextArea';
import ListContainer from '@/components/Mypage&Userpage/ListContainer';
import PetCardContainer from '@/components/Mypage&Userpage/PetCardContainer';
import Input from '@/components/common/Input';
import SmallModal from '@/components/common/SmallModal';
import UserAsk from '@/pages/Mypage/UserAsk';
import Modal from '@/components/common/Modal/index';
import PostCreate from '@/pages/PostCreate/index';
import TopBar from '@/components/common/TopBar';

// user api Mock 설정
const mock = new MockAdapter(axios, { delayResponse: 500 });

mock.onGet('/api/user').reply(200, {
  nickname: '케어버디',
  introduction: '소개글입니다^^',
  communityId: [
    // id는 api 고유 id값이 아니라 map순환을 위해 임시 부여한 id를 의미함
    { id: '1', category: 0, community: '눈', createdAt: '2024-01-01' },
    { id: '2', category: 0, community: '위식도', createdAt: '2024-01-02' },
    { id: '3', category: 1, community: '중성화', createdAt: '2024-01-03' },
  ],
  postId: [
    { title: '안녕하세요' },
    { title: '글제목입니다 ㅎㅎ' },
    { title: '동물이 최고야!!' },
  ]
});

const Container = styled.div`
`;

const Menu = styled.div`
  padding: 10px 10px 10px 0;
  font-weight: bold;
  font-size: 22px;
  border-bottom: 1px solid #cecece;
  padding-bottom: 10px;
`;

const Item = styled.a`
  font-weight: bold;
  padding: 10px 10px 10px 0;
`;

const UserContainer = styled.div`
  font-size: var(--font-size-md-1); //16
  display: flex;
  align-items: center;
  margin: 30px 0 30px 0;
`;

const List = styled.span`
  display: flex;
  align-items: center;
`;

const ListItem = styled.a<{ bold?: boolean }>`
  margin: 10px;
  display: flex;
  font-weight: ${({ bold }) => (bold ? 'bold' : 'normal')};
`;

const ImgContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 50px;
`;

const InputList = styled.span`
  display: flex;
`;

const ImageBox = styled.div`
  img {
    height: 180px;
    padding: 10px;
  }
`;

interface UserData {
  nickname: string;
  introduction: string;
  communityId: CommunityPost[];
  postId: PostId[];
}

interface CommunityPost {
  id: string;
  category: number;
  community: string;
  createdAt: string;
}

interface PostId {
  title: string;
}

const ProfileContainer: React.FC<{ userData: UserData }> = ({ userData }) => (
  <Container>
    <UserContainer>
      <ImgContainer>
        <ImageBox><img src={defaultImg} alt="프로필 사진" /></ImageBox>
      </ImgContainer>
      <Info>
        <InputList>
          <List>
            <ListItem bold>{userData.nickname}</ListItem>
          </List>
        </InputList>
        <InputList>
          <List>
            <ListItem>{userData.introduction}</ListItem>
          </List>
        </InputList>
      </Info>
    </UserContainer>
  </Container>
);

const Userpage: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    nickname: '',
    introduction: '',
    communityId: [],
    postId: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/user');
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const contentItems = [
    { id: '1', content: '프로필', component: <ProfileContainer userData={userData} /> },
    { id: '2', content: 'User의 반려동물', component: <PetCardContainer /> },
    { id: '3', content: '작성 글 목록', component: <ListContainer communityPosts={userData.communityId} postIds={userData.postId} isLoading={isLoading} /> },
  ];

  return (
    <Container>
      <TopBar category="Carebuddy" title="유저 페이지" />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        contentItems.map(item => (
          <React.Fragment key={item.id}>
            <Menu>
              <Item>{item.content}</Item>
            </Menu>
            {item.component}
          </React.Fragment>
        ))
      )}
    </Container>
  );
};

export default Userpage;
