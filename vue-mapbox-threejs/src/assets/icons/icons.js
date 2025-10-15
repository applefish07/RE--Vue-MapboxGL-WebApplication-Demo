const requireAll = (requireContext) => requireContext.keys().forEach(requireContext);
const req = require.context('./', false, /\.svg$/); // 加载当前目录下的所有 SVG 文件
requireAll(req);
