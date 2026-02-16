import type { Message } from '../types/chat';

export function buildDisplayTextForSave(message: Message): string {
  switch (message.role) {
    case 'user':
      return message.content;

    case 'ai': {
      const { rebuttal, improve, reason, risk } = message.sections;

      return [
        `【反論】\n${rebuttal}`,
        `【改善案】\n${improve}`,
        `【改善理由】\n${reason}`,
        `【改善後リスク】\n${risk}`,
      ].join('\n\n');
    }
  }
}
