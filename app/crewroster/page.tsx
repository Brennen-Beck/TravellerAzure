"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { z } from 'zod';
import { API_URL, GAME_ID, SHIP_ID } from "@/app/traveller.config";

// ─── CREW MEMBER DATA ────────────────────────────────────────────────────────────────
// Zod schema to validate the crew member data
const CrewMemberSchema = z.object({
  CrewMemberID: z.number(),
  FirstName: z.string(),
  LastName: z.string(),
  STR: z.number(),
  DEX: z.number(),
  END: z.number(),
  INT: z.number(),
  EDU: z.number(),
  SOC: z.number(),
  CHA: z.number().nullable(),
  CFI: z.number(),
  FCM: z.number(),
  FDM: z.number(),
  Fatigued: z.number(),
  Bank: z.number(),
  Portrait: z.string().nullable(),
});
type CrewMember = z.infer<typeof CrewMemberSchema>;

// ─── CREW MEMBER SKILLS ──────────────────────────────────────────────────────────────
const CrewMemberSkillsSchema = z.object({
  CrewMemberID: z.number(),
  SkillName: z.string(),
  Level: z.number(),
});
type CrewMemberSkill = z.infer<typeof CrewMemberSkillsSchema>;
const CrewMemberSkillsResponseSchema = z.object({
  Data: z.array(CrewMemberSkillsSchema),
});

// ─── CREW MEMBER ASSIGNMENTS ───────────────────────────────────────────────────────────
const CrewMemberAssignmentsSchema = z.object({
  CrewMemberID: z.number(),
  FirstName: z.string(),
  LastName: z.string(),
  Assignment: z.string(),
});
type CrewMemberAssignment = z.infer<typeof CrewMemberAssignmentsSchema>;
const CrewMemberAssignmentsResponseSchema = z.object({
  Data: z.array(CrewMemberAssignmentsSchema),
});

export default function CrewRosterPage() {
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCrewData() {
      try {
        const response = await fetch(`${API_URL}/CrewData/${GAME_ID}/${SHIP_ID}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const jsonData = await response.json();
        // Validate and parse the crew data
        const parsedData = jsonData.Data.map((member: any) =>
          CrewMemberSchema.parse(member)
        );
        setCrewMembers(parsedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        console.error("Error fetching crew data:", err);
      }
    }
    fetchCrewData();
  }, []);

  return (
    <section className='flex flex-col py-14 md:m-7 px-2 md:py-0 lg:m-3 lg:px-20 '>
      <div className='text-xl font-[orbitron] font-bold p-1'>
        <h1>Crew Roster</h1>
      </div>

      {error ? (
        <p className="text-red-500 font-bold">Error: {error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {crewMembers.length > 0 ? (
            crewMembers.map((member) => (
              <CrewCard key={member.CrewMemberID} member={member} />
            ))
          ) : (
            <p className="text-gray-500">No crew members available.</p>
          )}
        </div>
      )}
    </section>
  );
}

function CrewCard({ member }: { member: CrewMember }) {
  // State for skills and assignments for this crew member
  const [skills, setSkills] = useState<CrewMemberSkill[]>([]);
  const [assignments, setAssignments] = useState<CrewMemberAssignment[]>([]);
  const [skillError, setSkillError] = useState<string | null>(null);
  const [assignmentError, setAssignmentError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCrewMemberSkills() {
      try {
        const response = await fetch(
          `${API_URL}/CrewMemberSkills/${GAME_ID}/${SHIP_ID}/${member.CrewMemberID}`
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText}`);
        }
        const jsonData = await response.json();
        const parsed = CrewMemberSkillsResponseSchema.parse(jsonData);
        setSkills(parsed.Data);
      } catch (err) {
        setSkillError(err instanceof Error ? err.message : "An unknown error occurred");
        console.error("Error fetching crew member skills:", err);
      }
    }

    async function fetchCrewMemberAssignments() {
      try {
        const response = await fetch(
          `${API_URL}/CrewMemberAssignments/${GAME_ID}/${SHIP_ID}/${member.CrewMemberID}`
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText}`);
        }
        const jsonData = await response.json();
        const parsed = CrewMemberAssignmentsResponseSchema.parse(jsonData);
        setAssignments(parsed.Data);
      } catch (err) {
        setAssignmentError(err instanceof Error ? err.message : "An unknown error occurred");
        console.error("Error fetching crew member assignments:", err);
      }
    }

    fetchCrewMemberSkills();
    fetchCrewMemberAssignments();
  }, [member.CrewMemberID]);


  // Ensure the skills are sorted alphabetically
  const sortedSkills = [...skills].sort((a, b) => a.SkillName.localeCompare(b.SkillName));

  const columnCount = 3; // Define the number of columns
  const rowsPerColumn = Math.ceil(sortedSkills.length / columnCount);

  // Organize skills in a vertical-first order
  const skillColumns = Array.from({ length: columnCount }, (_, colIndex) =>
    sortedSkills.slice(colIndex * rowsPerColumn, (colIndex + 1) * rowsPerColumn)
  );


  return (
    <Card className="font-[roboto] w-[380px] min-w-[320px]">
      <CardTitle className="font-[orbitron] m-0 p-3 px-5">
        {member.FirstName} {member.LastName}
      </CardTitle>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {/* Crew Portrait */}
          <div>
            {member.Portrait ? (
              <Image
                src={`data:image/png;base64,${member.Portrait}`}
                alt={`${member.FirstName} ${member.LastName}`}
                width={96}
                height={96}
                className="w-24 h-24 object-cover rounded-lg shadow-md"
                unoptimized
              />
            ) : (
              <div className="w-24 h-24 bg-gray-300 flex items-center justify-center rounded-lg shadow-md">
                <span className="text-gray-600 text-sm">No Image</span>
              </div>
            )}
          </div>

          {/* Crew Attributes */}
          <div className="flex flex-col gap-1">
            <Label>{`STR: ${member.STR} (${getDMString(member.STR)})`}</Label>
            <Label>{`END: ${member.END} (${getDMString(member.END)})`}</Label>
            <Label>{`DEX: ${member.DEX} (${getDMString(member.DEX)})`}</Label>
            <Label>{`EDU: ${member.EDU} (${getDMString(member.EDU)})`}</Label>
            <Label>{`INT: ${member.INT} (${getDMString(member.INT)})`}</Label>
            <Label>{`SOC: ${member.SOC} (${getDMString(member.SOC)})`}</Label>
          </div>

          {/* Crew Stats */}
          <div className="flex flex-col gap-1">
            <Label>{`Bank: ${new Intl.NumberFormat("en-US").format(member.Bank)}`}</Label>
            <Label>{member.Fatigued ? "Fatigued" : "Not Fatigued"}</Label>
            <Label>{`CFI: ${member.CFI}`}</Label>
            <Label>{`FCM: ${member.FCM}`}</Label>
            <Label>{`FDM: ${member.FDM}`}</Label>
          </div>

          {/* Crew Member Skills */}
          <div className="col-span-3">
            <h4 className="font-bold">Skills:</h4>
            {skillError && <p className="text-red-500">{skillError}</p>}
            {skills.length > 0 ? (
              // Render the skills in a column-major layout
              <div className="grid grid-cols-3 gap-[0.1rem] m-0 ml-1 p-0">
                {Array.from({ length: rowsPerColumn }).map((_, rowIndex) =>
                  skillColumns.map((column, colIndex) => (
                    <div key={`${colIndex}-${rowIndex}`} className="grid m-0 p-0">
                      {column[rowIndex] && (
                        <Label>
                          {column[rowIndex].SkillName}: {column[rowIndex].Level}
                        </Label>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <p className="text-gray-500">No skills found.</p>
            )}
          </div>

          {/* Crew Member Assignments */}
          <div className="col-span-3">
            <h4 className="font-bold">Assignments:</h4>
            {assignmentError && <p className="text-red-500">{assignmentError}</p>}
            {assignments.length > 0 ? (
              <div className="flex flex-col gap-1 ml-1">
                {assignments.map((assignment, index) => (
                  <Label key={index}>
                    {assignment.Assignment}
                  </Label>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No assignments found.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to calculate the modifier based on the translation table
function getModifier(value: number): number {
  if (value < 1) return -3;
  if (value >= 1 && value <= 2) return -2;
  if (value >= 3 && value <= 5) return -1;
  if (value >= 6 && value <= 8) return 0;
  if (value >= 9 && value <= 11) return +1;
  if (value >= 12 && value <= 14) return +2;
  return +3; // value >= 15
}

// Helper function to return the modifier as a formatted string
function getDMString(value: number): string {
  const modifier = getModifier(value);
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}
