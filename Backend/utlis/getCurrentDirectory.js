// Save this js file in the directory whose path is to be get

import { fileURLToPath } from 'url';
import path from 'path';

// Convert import.meta.url to a filename
// export const __filename = fileURLToPath(import.meta.url);

// Get the directory name
export const __dirname = path.dirname(__filename);