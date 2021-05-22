import React from 'react';
import {
  NewCommunity,
  NewChannel,
  ChannelSettings,
  ChannelSettingsMenu,
  DeleteChannel,
} from '@dream/community';
import { useModal } from '@dream/utils/use-modal';
import { useIntl } from 'react-intl';
import { Auth } from '@dream/auth';
import { Modal } from '@dream/components/modal';
import { ModalFull } from '@dream/components/modal-full';

export const Modals = () => {
  const intl = useIntl();
  const modalProps = useModal();

  return (
    <>
      <Modal id="authModal" minimal {...modalProps}>
        <Auth />
      </Modal>
      <Modal
        id="newCommunity"
        title={intl.formatMessage({ id: 'newCommunityModalTitle' })}
        {...modalProps}
      >
        <NewCommunity />
      </Modal>
      <Modal id="newChannel" title="New Channel" {...modalProps}>
        <NewChannel />
      </Modal>
      <Modal id="deleteChannel" title="Delete Channel" minimal {...modalProps}>
        <DeleteChannel />
      </Modal>
      <ModalFull
        id="channelSettings"
        menu={<ChannelSettingsMenu />}
        {...modalProps}
      >
        <ChannelSettings />
      </ModalFull>
    </>
  );
};
