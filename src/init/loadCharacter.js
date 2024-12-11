export const loadCharactersFromDB = async () => {
    try {
        const rows = loadCharacters();
        const characterList = rows.map(row => ({
            type: row.id,
          }));
        return characterList;
    } catch (e) {
        console.error(e)
    }
}