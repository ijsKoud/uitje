"use client";

import { Button } from "@uitje/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@uitje/ui/dialog";
import { Share2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Props {
	results: string;
}

const ShareDialog: React.FC<Props> = ({ results }) => {
	const [url, setUrl] = useState("");
	useEffect(() => setUrl(window.location.href), []);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="secondary">
					<Share2Icon className="mr-2 h-4 w-4" /> Share this uitje
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Share this uitje</DialogTitle>
					<DialogDescription>
						You can share this uitje with other people, make sure to change the visibility to <strong>public</strong> if you want to share
						the URL!
					</DialogDescription>

					<div className="space-x-2">
						<Button variant="outline" className="w-fit" onClick={() => window.navigator.clipboard.writeText(url)}>
							copy url
						</Button>

						<Button variant="outline" className="w-fit" onClick={() => window.navigator.clipboard.writeText(results)}>
							copy results
						</Button>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

export default ShareDialog;
