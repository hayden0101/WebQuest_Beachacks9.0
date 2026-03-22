// Filters Service


class FiltersService {
  constructor() {

  }

  filterMessage(text) {
    if (!text || typeof text !== 'string') {
      return {
        filteredText: '',
        wasFiltered: false,
        filteredWords: []
      };
    }

    // No filtering performed — return the original text
    return {
      filteredText: text,
      wasFiltered: false,
      filteredWords: [],
      originalText: text
    };
  }

  isSafe(text) {
    // Without NSFW checks, consider input safe by default
    return true;
  }

  getFilteredWord(text) {
    const result = this.filterMessage(text);
    return result.filteredText;
  }
}

const filtersService = new FiltersService();

export function filterMessage(text) {
  return filtersService.filterMessage(text);
}

export function isSafe(text) {
  return filtersService.isSafe(text);
}

export function getFilteredWord(text) {
  return filtersService.getFilteredWord(text);
}

export default filtersService;
