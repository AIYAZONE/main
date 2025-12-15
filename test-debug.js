import { createPinia, setActivePinia } from 'pinia';
import { useBrandStore } from './src/stores/brandStore.js';

setActivePinia(createPinia());
const store = useBrandStore();

console.log('Initial error:', store.error);
store.setLoading(false, 'Test error');
console.log('After setLoading error:', store.error);
