import { exportOmniCarbonPptx } from '../src/utils/pptxExport.js';

console.log('Generating OmniCarbon Edolus PPTX Slide Deck...');
await exportOmniCarbonPptx();
console.log('Successfully generated OmniCarbon_Edolus_Slide_Deck.pptx!');
