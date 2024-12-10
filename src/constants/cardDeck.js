import CardData from '../classes/model/cardData.class.js';
import { Packets } from '../init/loadProtos.js';

export const loadCardTypes = () => {
  const cardTypes = [
    new CardData(Packets.CardType.BBANG, 20),
    new CardData(Packets.CardType.BIG_BBANG, 1),
    new CardData(Packets.CardType.SHIELD, 10),
    new CardData(Packets.CardType.VACCINE, 6),
    new CardData(Packets.CardType.CALL_119, 2),
    new CardData(Packets.CardType.DEATH_MATCH, 4),
    new CardData(Packets.CardType.GUERRILLA, 1),
    new CardData(Packets.CardType.ABSORB, 4),
    new CardData(Packets.CardType.HALLUCINATION, 4),
    new CardData(Packets.CardType.FLEA_MARKET, 3),
    new CardData(Packets.CardType.MATURED_SAVINGS, 2),
    new CardData(Packets.CardType.WIN_LOTTERY, 1),
    new CardData(Packets.CardType.SNIPER_GUN, 1),
    new CardData(Packets.CardType.HAND_GUN, 2),
    new CardData(Packets.CardType.DESERT_EAGLE, 3),
    new CardData(Packets.CardType.AUTO_RIFLE, 2),
    new CardData(Packets.CardType.LASER_POINTER, 1),
    new CardData(Packets.CardType.RADAR, 1),
    new CardData(Packets.CardType.AUTO_SHIELD, 2),
    new CardData(Packets.CardType.STEALTH_SUIT, 2),
    new CardData(Packets.CardType.CONTAINMENT_UNIT, 3),
    new CardData(Packets.CardType.SATELLITE_TARGET, 1),
    new CardData(Packets.CardType.BOMB, 1),
  ];

  cardDeck = cardTypes.flatMap(({ type, count }) => new Array(count).fill(type));
};

export let cardDeck;
