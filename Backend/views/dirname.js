import { dirname } from 'path'
import { fileURLToPath } from 'url'

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename)
const _privateDirname = _dirname;

export default _viewsDirname;