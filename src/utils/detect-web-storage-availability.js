/**
 * Check for Availablility of Web Storage APIs
 * @param {String} type Type of web storage API either `localStorage` or `sessionStorage`
 * @returns Boolean indicating whether the web storage API type is available
 */
export function checkForStorageAvailability(type) {
  let storage;

  try {
    storage = window[type]
    const storageKey = `__${type}_storage_test__`
    const storageValue = `${type} is available`
    storage.setItem(storageKey, storageValue)
    storage.removeItem(storageKey)

    return true
  } catch (error) {
    return (
      e instanceof DOMException &&
      (e.code === 22 || e.code === 1014 || e.name === "QuotaExceededError" || e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      storage &&
      storage.length !== 0
    );
  }
}