import { Component, createEffect, createSignal, For } from 'solid-js';

import styles from './EmojiPickPopover.module.scss';
import { useSettingsContext } from '../../contexts/SettingsContext';
import { debounce, getScreenCordinates, isVisibleInContainer, uuidv4 } from '../../utils';
import { useIntl } from '@cookbook/solid-intl';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import { settings as t } from '../../translations';
import { hookForDev } from '../../lib/devTools';
import ButtonLink from '../Buttons/ButtonLink';
import Modal from '../Modal/Modal';

import emojiSearch from '@jukben/emoji-search';
import { createStore } from 'solid-js/store';
import { EmojiOption } from '../../types/primal';
import ButtonPrimary from '../Buttons/ButtonPrimary';
import EmojiPicker from '../EmojiPicker/EmojiPicker';
import EmojiPickHeader from './EmojiPickHeader';
import { useAccountContext } from '../../contexts/AccountContext';

const defaultTerm = 'smile';

const EmojiPickModal: Component<{
  id?: string,
  open: boolean,
  onClose: (e: MouseEvent | KeyboardEvent) => void,
  onSelect: (emoji: EmojiOption) => void,
  orientation?: 'up' | 'down',
}> = (props) => {

  const account = useAccountContext();

  const [emojiSearchTerm, setEmojiSearchTerm] = createSignal(defaultTerm);
  const [focusInput, setFocusInput] = createSignal(false);
  const [showPreset, setShowPreset] = createSignal(true);

  const onKey = (e: KeyboardEvent) => {
    if (e.code === 'Escape') {
      props.onClose(e);
      return;
    }
  };

  createEffect(() => {
    if (props.open) {
      window.addEventListener('keydown', onKey);
      setTimeout(() => {
        setEmojiSearchTerm(() => 'smile');
        setFocusInput(() => true);
        setFocusInput(() => false);
      }, 10);
    }
    else {
      window.removeEventListener('keydown', onKey);
    }
  });

  createEffect(() => {
    if (emojiSearchTerm().length === 0) {
      setEmojiSearchTerm(() => defaultTerm)
    }
  });

  const setFilter = (filter: string) => {
    if (filter === 'default') {
      setShowPreset(true);
      setEmojiSearchTerm(() => 'smile');
    }
    else {
      setShowPreset(false);
      setEmojiSearchTerm(() => filter);
    }
  };


  return (
    <div
      id={props.id}
      class={`${styles.emojiPickHolder} ${props.orientation && styles[props.orientation]}`}
    >
      <div class={styles.zapEmojiChangeModal}>
        <EmojiPickHeader
          focus={focusInput()}
          onInput={setEmojiSearchTerm}
          onFilter={setFilter}
        />

        <EmojiPicker
          preset={showPreset() && account ? account.emojiHistory : []}
          filter={emojiSearchTerm()}
          onSelect={(emoji: EmojiOption) => {
            props.onSelect(emoji);
            setFocusInput(true);
            setFocusInput(() => false);
          }}
          short={props.orientation === 'up'}
        />
      </div>
    </div>
  );
}

export default EmojiPickModal;