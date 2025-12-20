const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Student = require('./models/Student');
const Grade = require('./models/Grade');
const Assignment = require('./models/Assignment');
const Attendance = require('./models/Attendance');
const Behavior = require('./models/Behavior');
const Message = require('./models/Message');
const Meeting = require('./models/Meeting');
const Announcement = require('./models/Announcement');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/parent-teacher-portal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Grade.deleteMany({});
    await Assignment.deleteMany({});
    await Attendance.deleteMany({});
    await Behavior.deleteMany({});
    await Message.deleteMany({});
    await Meeting.deleteMany({});
    await Announcement.deleteMany({});

    const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Art', 'Physical Education'];
    const gradeTypes = ['assignment', 'quiz', 'exam', 'project', 'participation'];
    const grades = ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
    const sections = ['A', 'B', 'C'];

    // Create multiple teachers
    console.log('👨‍🏫 Creating teachers...');
    const teacherData = [
      { firstName: 'Priya', lastName: 'Sharma', email: 'priya.sharma@school.com', subjectSpecialties: ['Mathematics', 'Science'] },
      { firstName: 'Rajesh', lastName: 'Kumar', email: 'rajesh.kumar@school.com', subjectSpecialties: ['English', 'History'] },
      { firstName: 'Anita', lastName: 'Verma', email: 'anita.verma@school.com', subjectSpecialties: ['Geography', 'Art'] },
      { firstName: 'Amit', lastName: 'Patel', email: 'amit.patel@school.com', subjectSpecialties: ['Physical Education', 'Science'] },
      { firstName: 'Sunita', lastName: 'Gupta', email: 'sunita.gupta@school.com', subjectSpecialties: ['Mathematics', 'English'] }
    ];

    const teachers = [];
    for (const tData of teacherData) {
      let teacher = await User.findOne({ email: tData.email });
      if (!teacher) {
        teacher = new User({
          firstName: tData.firstName,
          lastName: tData.lastName,
          email: tData.email,
          password: 'password123',
          role: 'teacher',
          phone: `555-${Math.floor(Math.random() * 9000) + 1000}`,
          address: `${Math.floor(Math.random() * 999) + 1} School Street`
        });
        await teacher.save();
        console.log(`   ✅ Created teacher: ${teacher.firstName} ${teacher.lastName}`);
      } else {
        console.log(`   ℹ️  Found teacher: ${teacher.firstName} ${teacher.lastName}`);
      }
      // Store teacher with subject specialties for later use
      teachers.push({ ...teacher.toObject(), subjectSpecialties: tData.subjectSpecialties, _id: teacher._id });
    }
    console.log(`✅ Created/Found ${teachers.length} teachers\n`);

    // Create multiple parents
    console.log('👨‍👩‍👧 Creating parents...');
    const parentData = [
      { firstName: 'Virat', lastName: 'Kohli', email: 'virat.kohli@example.com' },
      { firstName: 'Rahul', lastName: 'Mehta', email: 'rahul.mehta@example.com' },
      { firstName: 'Neha', lastName: 'Singh', email: 'neha.singh@example.com' },
      { firstName: 'Vikram', lastName: 'Reddy', email: 'vikram.reddy@example.com' },
      { firstName: 'Kavita', lastName: 'Joshi', email: 'kavita.joshi@example.com' },
      { firstName: 'Suresh', lastName: 'Nair', email: 'suresh.nair@example.com' },
      { firstName: 'Deepa', lastName: 'Iyer', email: 'deepa.iyer@example.com' },
      { firstName: 'Arun', lastName: 'Desai', email: 'arun.desai@example.com' },
      { firstName: 'Meera', lastName: 'Rao', email: 'meera.rao@example.com' }
    ];

    const parents = [];
    for (const pData of parentData) {
      let parent = await User.findOne({ email: pData.email });
      if (!parent) {
        parent = new User({
          firstName: pData.firstName,
          lastName: pData.lastName,
          email: pData.email,
          password: 'password123',
          role: 'parent',
          phone: `555-${Math.floor(Math.random() * 9000) + 1000}`,
          address: `${Math.floor(Math.random() * 999) + 1} Main Street`
        });
        await parent.save();
        console.log(`   ✅ Created parent: ${parent.firstName} ${parent.lastName}`);
      } else {
        console.log(`   ℹ️  Found parent: ${parent.firstName} ${parent.lastName}`);
      }
      parents.push(parent);
    }
    console.log(`✅ Created/Found ${parents.length} parents\n`);

    // Create multiple students with their parents
    console.log('📚 Creating students...');
    const studentNames = [
      { firstName: 'Anushka', lastName: 'Kohli', parentLastName: 'Kohli' },
      { firstName: 'Vamika', lastName: 'Kohli', parentLastName: 'Kohli' }, 
      { firstName: 'Arjun', lastName: 'Mehta', parentLastName: 'Mehta' },
      { firstName: 'Ishaan', lastName: 'Singh', parentLastName: 'Singh' },
      { firstName: 'Rohan', lastName: 'Reddy', parentLastName: 'Reddy' },
      { firstName: 'Aanya', lastName: 'Joshi', parentLastName: 'Joshi' },
      { firstName: 'Vivaan', lastName: 'Nair', parentLastName: 'Nair' },
      { firstName: 'Saanvi', lastName: 'Iyer', parentLastName: 'Iyer' },
      { firstName: 'Advait', lastName: 'Desai', parentLastName: 'Desai' },
      { firstName: 'Diya', lastName: 'Rao', parentLastName: 'Rao' },
      { firstName: 'Kabir', lastName: 'Mehta', parentLastName: 'Mehta' },
      { firstName: 'Anvi', lastName: 'Singh', parentLastName: 'Singh' },
      { firstName: 'Reyansh', lastName: 'Reddy', parentLastName: 'Reddy' },
      { firstName: 'Kiara', lastName: 'Joshi', parentLastName: 'Joshi' }
    ];

    const students = [];
    for (let i = 0; i < studentNames.length; i++) {
      const sName = studentNames[i];
      
      // Assign parent(s) to each student
      // Try to find parent by matching last name first, otherwise cycle through parents
      let primaryParent = parents.find(p => p.lastName === sName.parentLastName);
      let primaryParentIndex = 0;
      if (!primaryParent) {
        // If no matching last name, cycle through parents
        primaryParentIndex = i % parents.length;
        primaryParent = parents[primaryParentIndex];
      } else {
        // Find the index of the matched parent
        primaryParentIndex = parents.findIndex(p => p._id.toString() === primaryParent._id.toString());
      }
      
      // Some students have both parents (30% chance) - but NOT for Kohli students (they should only have Virat)
      const assignedParents = [primaryParent];
      if (sName.parentLastName !== 'Kohli' && Math.random() < 0.3 && parents.length > 1) {
        const secondaryParentIndex = (primaryParentIndex + 1) % parents.length;
        const secondaryParent = parents[secondaryParentIndex];
        if (secondaryParent._id.toString() !== primaryParent._id.toString()) {
          assignedParents.push(secondaryParent);
        }
      }
      
      const grade = grades[Math.floor(Math.random() * grades.length)];
      const section = sections[Math.floor(Math.random() * sections.length)];
      const studentSubjects = subjects.slice(0, 4 + Math.floor(Math.random() * 3));
      
      // Assign all teachers to each student (so teachers can see all students)
      // This ensures teachers can mark attendance for all students
      const assignedTeachers = [...teachers];

      // Check if student exists by studentId pattern OR by name for Kohli students
      const studentIdPattern = `STU${String(i + 1).padStart(4, '0')}`;
      let student = await Student.findOne({ studentId: studentIdPattern });
      
      // For Kohli students, also check by name to ensure they're linked to Virat
      if (!student && sName.lastName === 'Kohli') {
        student = await Student.findOne({ 
          firstName: sName.firstName, 
          lastName: sName.lastName 
        });
      }

      if (!student) {
        student = new Student({
          firstName: sName.firstName,
          lastName: sName.lastName,
          studentId: studentIdPattern,
          dateOfBirth: new Date(2010 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          grade,
          section,
          parentIds: assignedParents.map(p => p._id), // Assign parent(s)
          teacherIds: assignedTeachers.map(t => t._id),
          subjects: studentSubjects
        });
        await student.save();

        // Update each parent's associatedIds (refresh parent from DB to get latest)
        for (const parent of assignedParents) {
          const parentFromDB = await User.findById(parent._id);
          if (parentFromDB && !parentFromDB.associatedIds.includes(student._id)) {
            parentFromDB.associatedIds.push(student._id);
            await parentFromDB.save();
          }
        }

        const parentNames = assignedParents.map(p => `${p.firstName} ${p.lastName}`).join(' & ');
        console.log(`   ✅ Created student: ${student.firstName} ${student.lastName} (${student.studentId}) - ${grade} ${section}`);
        console.log(`      👨‍👩 Parent(s): ${parentNames}`);
      } else {
        // If student exists, ensure it has parents assigned
        if (!student.parentIds || student.parentIds.length === 0) {
          student.parentIds = assignedParents.map(p => p._id);
          await student.save();
          
          // Update parent's associatedIds
          for (const parent of assignedParents) {
            if (!parent.associatedIds.includes(student._id)) {
              parent.associatedIds.push(student._id);
              await parent.save();
            }
          }
          console.log(`   ✅ Updated student: ${student.firstName} ${student.lastName} - Added parent(s)`);
        } else {
          // For Kohli students, ensure they're ONLY linked to Virat Kohli
          if (sName.lastName === 'Kohli') {
            const viratKohli = parents.find(p => p.lastName === 'Kohli');
            if (viratKohli) {
              // Remove all other parents and only keep Virat
              student.parentIds = [viratKohli._id];
              await student.save();
              
              // Update Virat's associatedIds
              const viratFromDB = await User.findById(viratKohli._id);
              if (viratFromDB && !viratFromDB.associatedIds.includes(student._id)) {
                viratFromDB.associatedIds.push(student._id);
                await viratFromDB.save();
              }
              
              // Remove student from other parents' associatedIds
              for (const otherParent of parents) {
                if (otherParent._id.toString() !== viratKohli._id.toString()) {
                  const otherParentFromDB = await User.findById(otherParent._id);
                  if (otherParentFromDB && otherParentFromDB.associatedIds.includes(student._id)) {
                    otherParentFromDB.associatedIds = otherParentFromDB.associatedIds.filter(
                      id => id.toString() !== student._id.toString()
                    );
                    await otherParentFromDB.save();
                  }
                }
              }
              console.log(`   ✅ Updated student: ${student.firstName} ${student.lastName} - Assigned to Virat Kohli`);
            }
          } else {
            // For other students, ensure assigned parents are linked
            for (const parent of assignedParents) {
              // Refresh parent from DB
              const parentFromDB = await User.findById(parent._id);
              // Add student to parent if not already linked
              if (parentFromDB && !parentFromDB.associatedIds.includes(student._id)) {
                parentFromDB.associatedIds.push(student._id);
                await parentFromDB.save();
              }
              // Add parent to student if not already linked
              if (!student.parentIds.includes(parent._id)) {
                student.parentIds.push(parent._id);
                await student.save();
              }
            }
            console.log(`   ✅ Updated student: ${student.firstName} ${student.lastName} - Linked to parent(s)`);
          }
        }
      }
      students.push(student);
    }
    console.log(`✅ Created/Found ${students.length} students\n`);

    // Create grades for all students
    console.log('📊 Creating grades...');
    let totalGrades = 0;
    for (const student of students) {
      const studentSubjects = student.subjects || subjects.slice(0, 4);
      const numGrades = 10 + Math.floor(Math.random() * 10); // 10-20 grades per student

      for (let i = 0; i < numGrades; i++) {
        const subject = studentSubjects[Math.floor(Math.random() * studentSubjects.length)];
        const gradeType = gradeTypes[Math.floor(Math.random() * gradeTypes.length)];
        const gradeValue = Math.floor(Math.random() * 30) + 70; // 70-100
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 90)); // Last 90 days

        // Find a teacher who teaches this subject
        const teacher = teachers.find(t => t.subjectSpecialties?.includes(subject)) || teachers[0];

        const grade = new Grade({
          studentId: student._id,
          teacherId: teacher._id,
          subject,
          grade: gradeValue,
          maxGrade: 100,
          gradeType,
          comments: `${gradeType === 'exam' ? 'Great work on the exam!' : gradeType === 'project' ? 'Excellent project!' : 'Good effort!'}`,
          date
        });
        await grade.save();
        totalGrades++;
      }
    }
    console.log(`✅ Created ${totalGrades} grades\n`);

    // Create assignments
    console.log('📝 Creating assignments...');
    let totalAssignments = 0;
    for (const teacher of teachers) {
      const teacherSubjects = teacher.subjectSpecialties || subjects.slice(0, 2);
      const numAssignments = 3 + Math.floor(Math.random() * 3); // 3-5 assignments per teacher

      for (let i = 0; i < numAssignments; i++) {
        const subject = teacherSubjects[Math.floor(Math.random() * teacherSubjects.length)];
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 21) + 1); // Next 1-21 days

        // Assign to random students
        const assignedStudents = [];
        const numStudents = 3 + Math.floor(Math.random() * 5);
        for (let j = 0; j < numStudents && j < students.length; j++) {
          const student = students[Math.floor(Math.random() * students.length)];
          if (!assignedStudents.find(s => s._id.toString() === student._id.toString())) {
            assignedStudents.push(student);
          }
        }

        const assignment = new Assignment({
          title: `${subject} Assignment ${i + 1}`,
          description: `Complete the ${subject.toLowerCase()} assignment and submit by the due date. Make sure to follow all guidelines.`,
          subject,
          teacherId: teacher._id,
          studentIds: assignedStudents.map(s => s._id),
          dueDate,
          maxGrade: 100,
          status: 'published'
        });
        await assignment.save();
        totalAssignments++;
      }
    }
    console.log(`✅ Created ${totalAssignments} assignments\n`);

    // Create attendance records (subject-wise)
    console.log('📅 Creating attendance records (subject-wise)...');
    let totalAttendance = 0;
    for (const student of students) {
      const studentSubjects = student.subjects || subjects.slice(0, 4);
      const attendanceStatuses = ['present', 'present', 'present', 'present', 'late', 'absent']; // Mostly present

      // Create attendance for last 30 days
      for (let day = 0; day < 30; day++) {
        const date = new Date();
        date.setDate(date.getDate() - (30 - day));

        // Create attendance for each subject
        for (const subject of studentSubjects) {
          const status = attendanceStatuses[Math.floor(Math.random() * attendanceStatuses.length)];
          
          // Find a teacher who teaches this subject
          const teacher = teachers.find(t => t.subjectSpecialties?.includes(subject)) || teachers[0];

          // Check if attendance already exists
          const existing = await Attendance.findOne({
            studentId: student._id,
            date: { $gte: new Date(date.setHours(0, 0, 0, 0)), $lt: new Date(date.setHours(23, 59, 59, 999)) },
            subject
          });

          if (!existing) {
            const attendance = new Attendance({
              studentId: student._id,
              teacherId: teacher._id,
              date,
              status,
              subject,
              notes: status === 'late' ? 'Arrived 10 minutes late' : status === 'absent' ? 'Absent without notice' : ''
            });
            await attendance.save();
            totalAttendance++;
          }
        }
      }
    }
    console.log(`✅ Created ${totalAttendance} attendance records\n`);

    // Create behavior reports
    console.log('🎯 Creating behavior reports...');
    const behaviorTypes = ['positive', 'positive', 'positive', 'neutral', 'negative'];
    const categories = ['academic', 'social', 'behavioral', 'participation'];
    let totalBehaviors = 0;

    for (const student of students) {
      const numReports = 3 + Math.floor(Math.random() * 5); // 3-7 reports per student
      const studentSubjects = student.subjects || subjects.slice(0, 4);

      for (let i = 0; i < numReports; i++) {
        const type = behaviorTypes[Math.floor(Math.random() * behaviorTypes.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];
        const subject = studentSubjects[Math.floor(Math.random() * studentSubjects.length)];
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 60));

        const teacher = teachers[Math.floor(Math.random() * teachers.length)];

        const behavior = new Behavior({
          studentId: student._id,
          teacherId: teacher._id,
          type,
          category,
          title: type === 'positive' ? 'Excellent participation' : type === 'negative' ? 'Needs improvement' : 'Observation',
          description: type === 'positive' 
            ? 'Student showed great enthusiasm and contributed valuable insights during class discussion.'
            : type === 'negative'
            ? 'Student needs to focus more during lessons and complete assignments on time.'
            : 'General observation noted.',
          date,
          severity: type === 'negative' ? 'medium' : 'low',
          subject
        });
        await behavior.save();
        totalBehaviors++;
      }
    }
    console.log(`✅ Created ${totalBehaviors} behavior reports\n`);

    // Create messages between parents and teachers
    console.log('💬 Creating messages...');
    let totalMessages = 0;
    for (let i = 0; i < 20; i++) {
      const parent = parents[Math.floor(Math.random() * parents.length)];
      const teacher = teachers[Math.floor(Math.random() * teachers.length)];
      const student = students.find(s => s.parentIds.includes(parent._id));
      
      if (student) {
        const messageTemplates = [
          {
            senderId: teacher._id,
            receiverId: parent._id,
            subject: 'Student Progress Update',
            content: `Hello ${parent.firstName}, I wanted to update you on ${student.firstName}'s excellent progress. Keep up the great work!`
          },
          {
            senderId: parent._id,
            receiverId: teacher._id,
            subject: 'Question about Assignment',
            content: `Hi ${teacher.firstName}, I have a question about the recent assignment. When is it due?`
          },
          {
            senderId: teacher._id,
            receiverId: parent._id,
            subject: 'Parent-Teacher Meeting Request',
            content: `I would like to schedule a meeting to discuss ${student.firstName}'s academic performance. Please let me know your availability.`
          }
        ];

        const template = messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
        const message = new Message({
          ...template,
          studentId: student._id,
          isRead: Math.random() > 0.5
        });
        await message.save();
        totalMessages++;
      }
    }
    console.log(`✅ Created ${totalMessages} messages\n`);

    // Create meetings (some pending for teachers to accept)
    console.log('📅 Creating meetings...');
    let totalMeetings = 0;
    for (let i = 0; i < 10; i++) {
      const parent = parents[Math.floor(Math.random() * parents.length)];
      const teacher = teachers[Math.floor(Math.random() * teachers.length)];
      const student = students.find(s => s.parentIds.includes(parent._id));
      
      if (student) {
        const meetingDate = new Date();
        meetingDate.setDate(meetingDate.getDate() + Math.floor(Math.random() * 14) + 1); // Next 1-14 days
        
        const statuses = ['pending', 'pending', 'confirmed', 'confirmed', 'completed'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        const meeting = new Meeting({
          title: 'Parent-Teacher Conference',
          description: `Discussing ${student.firstName}'s progress and academic goals`,
          parentId: parent._id,
          teacherId: teacher._id,
          studentId: student._id,
          scheduledDate: meetingDate,
          duration: 30,
          status,
          location: ['in-person', 'online', 'phone'][Math.floor(Math.random() * 3)],
          requestedBy: 'parent',
          notes: status === 'pending' ? 'Awaiting teacher confirmation' : 'Please bring any questions you may have.'
        });
        await meeting.save();
        totalMeetings++;
      }
    }
    console.log(`✅ Created ${totalMeetings} meetings (some pending for teachers to accept)\n`);

    // Create announcements
    console.log('📢 Creating announcements...');
    const announcementData = [
      {
        title: 'Welcome to the New School Year!',
        content: 'We are excited to welcome all students and parents to the new academic year. Please check the portal regularly for updates and announcements.',
        targetAudience: 'all',
        priority: 'high'
      },
      {
        title: 'Parent-Teacher Meeting Schedule',
        content: 'Parent-teacher meetings will be held next week. Please schedule your preferred time slot through the portal.',
        targetAudience: 'parents',
        priority: 'medium'
      },
      {
        title: 'Science Fair Coming Soon',
        content: 'The annual science fair is scheduled for next month. Students should start preparing their projects.',
        targetAudience: 'all',
        priority: 'low'
      },
      {
        title: 'Mid-Term Exams Schedule',
        content: 'Mid-term examinations will begin next week. Please ensure students are well-prepared.',
        targetAudience: 'all',
        priority: 'high'
      },
      {
        title: 'School Holiday Notice',
        content: 'School will be closed next Friday for a public holiday. Classes will resume on Monday.',
        targetAudience: 'all',
        priority: 'medium'
      }
    ];

    for (const annData of announcementData) {
      const teacher = teachers[Math.floor(Math.random() * teachers.length)];
      const announcement = new Announcement({
        ...annData,
        authorId: teacher._id
      });
      await announcement.save();
    }
    console.log(`✅ Created ${announcementData.length} announcements\n`);

    // Verify all students have parents
    console.log('\n🔍 Verifying parent assignments...');
    let studentsWithoutParents = 0;
    for (const student of students) {
      const studentWithParents = await Student.findById(student._id).populate('parentIds', 'firstName lastName email');
      if (!studentWithParents.parentIds || studentWithParents.parentIds.length === 0) {
        console.log(`   ⚠️  Student ${student.firstName} ${student.lastName} has no parents assigned!`);
        studentsWithoutParents++;
      }
    }
    
    if (studentsWithoutParents === 0) {
      console.log(`   ✅ All ${students.length} students have parents assigned!\n`);
    } else {
      console.log(`   ⚠️  ${studentsWithoutParents} students are missing parents\n`);
    }

    // Show parent-student relationships
    console.log('👨‍👩‍👧 Parent-Student Relationships:');
    for (const parent of parents) {
      const parentWithStudents = await User.findById(parent._id);
      const studentCount = parentWithStudents.associatedIds?.length || 0;
      if (studentCount > 0) {
        const studentDetails = await Student.find({ _id: { $in: parentWithStudents.associatedIds } })
          .select('firstName lastName studentId');
        const studentNames = studentDetails.map(s => `${s.firstName} ${s.lastName}`).join(', ');
        console.log(`   ${parent.firstName} ${parent.lastName}: ${studentCount} child(ren) - ${studentNames}`);
      }
    }

    console.log('\n🎉 Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Teachers: ${teachers.length}`);
    console.log(`   - Parents: ${parents.length}`);
    console.log(`   - Students: ${students.length}`);
    console.log(`   - Grades: ${totalGrades}`);
    console.log(`   - Assignments: ${totalAssignments}`);
    console.log(`   - Attendance Records: ${totalAttendance}`);
    console.log(`   - Behavior Reports: ${totalBehaviors}`);
    console.log(`   - Messages: ${totalMessages}`);
    console.log(`   - Meetings: ${totalMeetings} (some pending for teachers to accept)`);
    console.log(`   - Announcements: ${announcementData.length}`);
    console.log('\n🔑 Login Credentials:');
    console.log('   Teachers:');
    const allTeachers = await User.find({ role: 'teacher' }).limit(3);
    allTeachers.forEach(t => console.log(`     - ${t.email} / password123`));
    console.log('   Parents:');
    const allParents = await User.find({ role: 'parent' }).limit(3);
    allParents.forEach(p => console.log(`     - ${p.email} / password123`));
    console.log('\n✨ Refresh your dashboard to see the data!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

seedDatabase();
