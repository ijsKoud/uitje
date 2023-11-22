import React, { useMemo, useState } from "react";

export const useMultiStepForm = () => {
	const [step, setStep] = useState(0);
	const [steps, setSteps] = useState<React.ReactNode[]>([]);
	const form = useMemo(() => steps[step], [step, steps]);

	/** Navigates to the next step */
	const nextStep = () => {
		if (step >= steps.length - 1) setStep(steps.length - 1);
		setStep((x) => x + 1);
	};

	/** Navigates back to the previous step */
	const previousStep = () => {
		if (step <= 0) return setStep(0);
		setStep(step - 1);
	};

	return { step, form, nextStep, previousStep, setStep, setSteps, steps };
};
