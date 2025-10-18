import React, { useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router";
import { TypeAnimation } from "react-type-animation";

const SearchBar = ({ setSearch }) => {
	const navigate = useNavigate();

	const handleClickOnSearchBar = (e) => {
		setSearch(true);
		navigate("/search");
	};	

	return (
		<div
			className="border border-neutral-400 hover:border-amber-400 text-neutral-500 min-h-9 bg-slate-50 rounded-xl px-2 flex flex-1 items-center gap-2 hover:cursor-text select-none max-w-full group"
			onClick={handleClickOnSearchBar}
		>
			<div className="search cursor-pointer">
				<IoIosSearch size={20}  className="group-hover:text-amber-400" />
			</div>
			<div className="flex items-center gap-2 sm:text-[0.95rem] text-sm">
				<div>Search</div>
				<TypeAnimation
					sequence={[
						// Same substring at the start will only be typed out once, initially
						'"atta"',
						1000,
						'"dal"',
						1000,
						'"chawal"',
						1000,
						'"ghee"',
						1000,
						'"eggs"',
						1000,
						'"honey"',
						1000,
						'"sugar"',
						1000,
						'"paneer"',
						1000,
						'"paan"',
						1000,
						'"chocolate"',
						1000,
						'"curd"',
						1000,
					]}
					wrapper="span"
					speed={50}
					repeat={Infinity}
				/>
			</div>
		</div>
	);
};

export default SearchBar;
