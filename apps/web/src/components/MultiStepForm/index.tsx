"use client";

import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useMultiStepForm } from "./hooks";
import { Button } from "@uitje/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { cn } from "@uitje/utils";
import { Avatar, AvatarFallback } from "@uitje/ui/avatar";

const MultiStepFormWrapperContext = createContext<ReturnType<typeof useMultiStepForm>>({
	step: 0,
	steps: [],
	form: null as React.ReactNode,
	nextStep: () => void 0,
	previousStep: () => void 0,
	setStep: () => void 0,
	setSteps: () => void 0
});

const useMultiStepFormContext = () => useContext(MultiStepFormWrapperContext);

const MultiStepFormWrapper: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
	const ctx = useMultiStepForm();

	return (
		<MultiStepFormWrapperContext.Provider value={ctx}>
			<div className={cn("space-y-8", className)}>{children}</div>
		</MultiStepFormWrapperContext.Provider>
	);
};

const MultiStepFormProgressbar: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
	return <div className={cn("flex items-center justify-between w-full", className)}>{children}</div>;
};

const MultiStepFormProgressbarItem: React.FC<React.PropsWithChildren<{ step: number }>> = ({ children, step }) => {
	const ctx = useMultiStepFormContext();
	const isActive = useMemo(() => step <= ctx.step, [step, ctx.step]);

	return (
		<button onClick={() => ctx.setStep(step)} aria-label={`Navigate to step ${step + 1}`} className="flex flex-col items-center gap-y-2">
			<Avatar>
				<AvatarFallback className={cn(isActive ? "bg-primary" : "bg-muted")}>{step + 1}</AvatarFallback>
			</Avatar>

			<div>{children}</div>
		</button>
	);
};

const MultiStepFormList: React.FC<{ children: React.ReactNode[] }> = ({ children }) => {
	const ctx = useMultiStepFormContext();
	useEffect(() => ctx.setSteps(children), [children, ctx]);

	return ctx.form;
};

const MultiStepFormNavigation: React.FC<{ submit?: React.ReactNode; className?: string }> = ({ submit, className }) => {
	const { nextStep, previousStep, step, steps } = useMultiStepFormContext();

	return (
		<div className={cn("flex items-center justify-between", className)}>
			{step > 0 ? (
				<Button type="button" variant="outline" onClick={previousStep}>
					<ArrowLeftIcon className="mr-2 h-4 w-4" /> Previous
				</Button>
			) : (
				<div />
			)}

			{step < steps.length - 1 ? (
				<Button type="button" variant="outline" onClick={nextStep}>
					<ArrowRightIcon className="mr-2 h-4 w-4" /> Next
				</Button>
			) : (
				submit
			)}
		</div>
	);
};

export { MultiStepFormWrapper, MultiStepFormList, MultiStepFormProgressbar, MultiStepFormProgressbarItem, MultiStepFormNavigation };
