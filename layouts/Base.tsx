import { useRouter } from 'next/router';
import { lighten, rgba } from 'polished';
import { ReactNode, useState, FC } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { YMInitializer } from 'react-yandex-metrika';
import styled from 'styled-components';
import Auth from '../components/Auth';
import { BuyCoins } from '../components/BuyCoins';
import { CreatePost } from '../components/Post/CreatePost';
import { CreateCommunity } from '../components/Community/Create';
import TopNav from '../components/Nav/Top';
import PostView from '../components/Post/FeedView';
import { PromoterHelp } from '../components/Help/Promoter';
import { Modal } from '../ui';
import { ClipModal } from '../components/Clip/ClipModal';
import config from '../config';
const LEFT_MENU_WIDTH = 240;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: ${({ theme }) => theme.dark1Color};
`;

const Content = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const Left = styled.div<{ isOpen: boolean }>`
  background: ${({ theme }) => lighten(0.03, theme.dark1Color)};
  width: ${LEFT_MENU_WIDTH}px;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  z-index: 100;
  transition: 0.3s;

  @media (max-width: 700px) {
    left: ${({ isOpen }) => (isOpen ? 0 : -LEFT_MENU_WIDTH)}px;
  }
`;

const PostsBox = styled.div<{ noLeftMenu?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-left: 0;
  transition: 0.3s;

  @media (min-width: 700px) {
    padding-left: ${({ noLeftMenu }) => (noLeftMenu ? 0 : LEFT_MENU_WIDTH)}px;
  }
`;

const ContentBox = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
`;

const ContentInsideBox = styled.div`
  height: 100%;
  display: flex;
`;

const Overlay = styled.div<{ leftMenuIsOpen: boolean }>`
  display: none;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => rgba(theme.dark1Color, 0.95)};
  z-index: 50;

  @media (max-width: 700px) {
    ${({ leftMenuIsOpen }) => leftMenuIsOpen && 'display: block;'}
  }
`;

interface IProps {
  fixedTopContent?: ReactNode;
  leftMenu?: ReactNode;
}

const BaseLayout: FC<IProps> = ({ children, fixedTopContent, leftMenu }) => {
  const router = useRouter();

  if (!router) {
    return null;
  }

  const [leftMenuIsOpen, setLeftMenuIsOpen] = useState(false);

  let clipId = null;
  let postId = null;
  let backPath = null;

  if (typeof router.query.clipId === 'string') {
    clipId = router.query.clipId;
  }

  if (typeof router.query.postId === 'string') {
    postId = router.query.postId;
  }

  if (typeof router.query.backPath === 'string') {
    backPath = router.query.backPath;
  }

  return (
    <Box>
      <Modal
        visible={!!clipId}
        minimal
        onClose={() => router.replace(backPath)}
      >
        <ClipModal clipId={clipId} />
      </Modal>

      <Modal
        visible={!!postId}
        minimal
        onClose={() => router.replace(backPath)}
      >
        <div style={{ width: '1000px' }}>
          <PostView id={postId} autoPlay />
        </div>
      </Modal>

      <Modal
        title="Купить PepeCoin"
        visible={router.query.buyCoinsModal === '1'}
        onClose={() => router.back()}
      >
        <BuyCoins />
      </Modal>

      <Modal
        minimal
        visible={router.query.authModal === '1'}
        onClose={() => router.back()}
      >
        <Auth />
      </Modal>
      <Modal
        title="Новый клип"
        visible={router.query.newPost === '1'}
        onClose={() => router.back()}
      >
        <CreatePost />
      </Modal>
      <Modal
        title="Новое сообщество"
        visible={router.query.newCommunity === '1'}
        onClose={() => router.back()}
      >
        <CreateCommunity />
      </Modal>

      <Modal
        minimal
        title="Как работает продвижение"
        visible={router.query.howToPromoter === '1'}
        onClose={() => router.back()}
      >
        <PromoterHelp />
      </Modal>

      <ContentBox>
        <TopNav leftMenuTrigger={() => setLeftMenuIsOpen(!leftMenuIsOpen)} />
        <Content>
          <ContentInsideBox>
            {leftMenu && (
              <Left isOpen={leftMenuIsOpen}>
                <Scrollbars autoHide universal>
                  {leftMenu}
                </Scrollbars>
              </Left>
            )}
            <PostsBox id="layoutContent" noLeftMenu={!leftMenu}>
              {fixedTopContent}
              <Scrollbars
                autoHide
                universal
                renderView={props => <div {...props} id="mainScroll" />}
              >
                {children}
              </Scrollbars>
            </PostsBox>
          </ContentInsideBox>
          <Overlay
            leftMenuIsOpen={leftMenuIsOpen}
            onClick={() => setLeftMenuIsOpen(false)}
          />
        </Content>
      </ContentBox>
      <YMInitializer accounts={[config.yandexMetrikaId]} version="2" />
    </Box>
  );
};

export default BaseLayout;
