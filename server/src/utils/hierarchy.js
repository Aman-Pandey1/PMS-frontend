import User from '../models/User.js';

export const getSupervisorsChain = async (userId) => {
	const chain = [];
	let current = await User.findById(userId).select('_id supervisor');
	const visited = new Set();
	while (current && current.supervisor && !visited.has(String(current._id))) {
		visited.add(String(current._id));
		const sup = await User.findById(current.supervisor).select('_id supervisor');
		if (!sup) break;
		chain.push(sup._id);
		current = sup;
	}
	return chain;
};

export const isDirectSubordinate = async (supervisorId, userId) => {
	const user = await User.findById(userId).select('_id supervisor');
	if (!user) return false;
	return String(user.supervisor || '') === String(supervisorId);
};

export const getAllHigherAuthorities = async (userId) => {
	return getSupervisorsChain(userId);
};