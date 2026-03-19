"use server";
import { userRepository } from "@/lib/repositories/userRepository";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { User } from "@/lib/utilities/interfaces";


export async function getAllWorkers() {
 return await userRepository.findAllWorkers()
}
