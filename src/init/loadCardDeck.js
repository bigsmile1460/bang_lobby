

export const loadCardDeckFromDB = async () => {
    try {
        const rows = loadCards();
        const cardDeck = [];
        rows.forEach(({ card_type, card_count }) => {
            for (let i = 0; i < card_count; i++) {
              cardDeck.push(card_type); 
            }
          });
        return cardDeck;
    } catch (e) {
        console.error(e)
    }
}