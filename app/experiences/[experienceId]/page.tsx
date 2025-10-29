import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export default async function ExperiencePage({
	params,
  }: {
	params: Promise<{ experienceId: string }>;
  }) {
	const headersList = await headers();
	const { experienceId } = await params;
	const { userId } = await whopSdk.verifyUserToken(headersList);
  
	const result = await whopSdk.access.checkIfUserHasAccessToExperience({
	  userId,
	  experienceId,
	});
  
	if (!result.hasAccess) {
	  redirect("/discover");
	}
  
	redirect("/");
  }
  
