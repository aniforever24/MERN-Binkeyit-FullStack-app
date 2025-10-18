import { fileURLToPath } from 'url';
import path from 'path';

// Convert import.meta.url to a filename
export const __filename = fileURLToPath(import.meta.url);

// Get the directory name
const __dirname = path.dirname(__filename);

export default __dirname