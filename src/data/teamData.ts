export interface StaffMember {
  id: string;
  name: string;
  designation: string;
  subTitle?: string;
  image?: string;
}

export const staffMembers: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Sadique C Rahman',
    designation: 'Chairman',
    image: '/images/team/Sadique C Rahman.jpg',
  },
  {
    id: 'staff-2',
    name: 'Daliya Ambat Joseph',
    designation: 'Managing Director',
    image: '/images/team/Daliya Ambat Joseph.jpg',
  },
  {
    id: 'staff-3',
    name: 'CA Riyas PM',
    designation: 'Financial Consultant',
    subTitle: 'Riyas PM & Associates',
    image: '/images/team/CA Riyas PM.jpg',
  },
  {
    id: 'staff-4',
    name: 'Ar. Honey Govindh',
    designation: 'Principal Architect',
    image: '/images/team/Ar Honey Govindh.jpg',
  },
  {
    id: 'staff-5',
    name: 'Er. Govindh Unnikrishnan',
    designation: 'Structural Engineer',
    image: '/images/team/Er Govindh Unnikrishnan.jpg',
  },
];
