import archivalSpace from '@js/ArchivalSpace';
import PeerConnection from '@js/PeerConnection';
import {startRecordingAudio, sendAudio} from '@js/MessageRecords/audio';
import RoomForm from '@js/RoomForm';
import {sendMessage} from '@js/MessageRecords/sendText';

class Togethernet {
  initialize = async () => {
    await this.initArchivalSpace();
    this.attachUIEvents();
    new RoomForm().initialize();
    new PeerConnection().connect();
  }

  initArchivalSpace = async () => {
    await archivalSpace.fetchArchivedMessages();
    archivalSpace.render();
  }
 
  attachUIEvents = () => {
    this.preventPageScroll();
    this.handleMessageSendingEvents();
    // this.handleAudioEvents();
    this.detectThreadStart();
    this.hideInteractionButtonsOnMouseLeave();
    this.navigateToArchivalSpaceEvent();
  }

  preventPageScroll = () => {
    $(document).on('keydown', (e) => {
      if (['ArrowUp', 'ArrowLeft', 'ArrowRight', 'ArrowDown'].includes(e.key)){
        e.preventDefault();
      }
    });
  }

  handleMessageSendingEvents = () => {
    $('#_messageInput').on('keyup', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  handleAudioEvents = () => {
    $('#_recordBtn').on('mousedown', startRecordingAudio);
    $('#_recordBtn').on('mouseup', sendAudio);
  }

  detectThreadStart = () => {
    $('#messageType').on('messageThread', (e) => {
      if (e.threadPreviousMessage) {
        $(e.target).attr('data-thread-entry-message', e.threadPreviousMessage.id);
      } else {
        $(e.target).removeAttr('data-thread-entry-message');
      }
    });
  }

  hideInteractionButtonsOnMouseLeave = () => {
    $(document).on('mouseup', () => $('.longPressButton').hide());
  }

  navigateToArchivalSpaceEvent = () => {
    $('#archivalSpaceLink').on('click', () => {
      $('.chat').hide();
      $('#archivalSpace').show();
      $('#_messageInput').attr('disabled', true);
    });
  }
}

export default Togethernet;