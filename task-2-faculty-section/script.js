document.addEventListener('DOMContentLoaded', () => {
  // Test data of faculty members
  const facultyData = [
    {
      id: 'john-doe',
      name: 'Mr. John Doe',
      role: 'Head of Junior School',
      image: 'assets/faculty-john-doe.jpg',
      bio: "Mr. Doe has been instrumental in shaping our junior school curriculum for over 15 years, fostering a love for learning through hands-on activities and creative projects. He believes in nurturing each child's unique potential and provides a supportive environment for their growth.",
    },
    {
      id: 'jane-smith',
      name: 'Ms. Jane Smith',
      role: 'Head of Senior School',
      image: 'assets/faculty-jane-smith.jpg',
      bio: 'Ms. Smith brings a wealth of experience in academic excellence and student leadership. Her passion for empowering senior students to achieve their best, both academically and personally, is evident in her innovative teaching methods and mentorship programs.',
    },
    {
      id: 'mary-williams',
      name: 'Dr. Mary Williams',
      role: 'Head of Science Department',
      image: 'assets/faculty-mary-williams.jpg',
      bio: 'Dr. Williams, a seasoned scientist and educator, leads our thriving Science Department. Her engaging approach to complex scientific concepts makes learning enjoyable and encourages students to explore the wonders of the natural world through practical experiments and critical thinking.',
    },
    {
      id: 'sarah-jones',
      name: 'Mrs. Sarah Jones',
      role: 'Head of Arts Department',
      image: 'assets/faculty-sarah-jones.jpg',
      bio: 'Mrs. Jones is the creative force behind our vibrant Arts Department. She inspires students to express themselves through various artistic mediums, fostering creativity, imagination, and a deep appreciation for culture. Her dedication has led to numerous award-winning student projects.',
    },
    {
      id: 'michael-brown',
      name: 'Mr. Michael Brown',
      role: 'Sports Coordinator',
      image: 'assets/faculty-michael-brown.jpg',
      bio: "Mr. Brown coordinates all sports activities, encouraging physical fitness and teamwork. His energetic spirit and dedication to fostering healthy competition have made our school's sports program a source of pride and enthusiasm for students of all ages.",
    },
    {
      id: 'emily-white',
      name: 'Ms. Emily White',
      role: 'Librarian & Reading Specialist',
      image: 'assets/faculty-emily-white.jpg',
      bio: 'Ms. White is the heart of our school library, cultivating a love for reading and literature. She curates diverse collections, organizes engaging reading programs, and helps students develop critical thinking and research skills, preparing them for a lifetime of learning.',
    },
  ]

  const facultyGrid = document.getElementById('facultyGrid')
  const modalOverlay = document.getElementById('facultyModalOverlay')
  const modalCloseButton = modalOverlay.querySelector('.modal-close')
  const modalBody = document.getElementById('modalBody')

  let currentlyFocusedCard = null // To store reference for focus management

  // Function to create a single faculty card HTML element
  const createFacultyCard = (faculty) => {
    const card = document.createElement('div')
    card.classList.add('faculty-card')
    card.dataset.id = faculty.id // Store ID for easy lookup
    card.tabIndex = 0 // Make cards focusable by keyboard
    card.setAttribute('role', 'button') // Indicate it's interactive for screen readers
    card.setAttribute('aria-haspopup', 'dialog') // Tells screen readers that clicking on card will open a pop-up window

    card.innerHTML = `
            <div class="faculty-card-image-container">
                <img src="${faculty.image}" alt="${faculty.name}" class="faculty-card-image">
            </div>
            <div class="faculty-card-content">
                <h3>${faculty.name}</h3>
                <p>${faculty.role}</p>
            </div>
        `
    return card
  }

  // Function to render all faculty cards
  const renderFacultyCards = () => {
    facultyData.forEach((faculty) => {
      const card = createFacultyCard(faculty)
      facultyGrid.appendChild(card)
    })
  }

  // Function to populate and open the modal
  const openModal = (faculty) => {
    modalBody.innerHTML = `
            <div class="modal-image-wrapper">
                <img src="${faculty.image}" alt="${faculty.name}" class="modal-image">
            </div>
            <h3 id="modalTitle">${faculty.name}</h3>
            <p class="modal-role">${faculty.role}</p>
            <p>${faculty.bio}</p>
        `
    modalOverlay.classList.add('is-open')

    // Accessibility: Trap focus within the modal
    modalCloseButton.focus() // Set initial focus to the close button
    modalOverlay.addEventListener('keydown', trapModalFocus)

    // Accessibility: Prevent background scrolling
    document.body.style.overflow = 'hidden'

    // Accessibility: Hide background content from screen readers
    document.querySelector('.meet-faculty').setAttribute('aria-hidden', 'true')
  }

  // Function to close the modal
  const closeModal = () => {
    modalOverlay.classList.remove('is-open')
    modalOverlay.removeEventListener('keydown', trapModalFocus) // Clean up event listener

    // Accessibility: Restore background scrolling
    document.body.style.overflow = ''

    // Accessibility: Show background content to screen readers again
    document.querySelector('.meet-faculty').removeAttribute('aria-hidden')

    // Accessibility: Return focus to the element that opened the modal
    if (currentlyFocusedCard) {
      currentlyFocusedCard.focus()
      currentlyFocusedCard = null // Clear reference
    }
  }

  // Event listener for clicking on faculty cards
  facultyGrid.addEventListener('click', (event) => {
    const card = event.target.closest('.faculty-card')
    if (card) {
      currentlyFocusedCard = card // Store the clicked card for focus return
      const facultyId = card.dataset.id
      const selectedFaculty = facultyData.find((f) => f.id === facultyId)
      if (selectedFaculty) {
        openModal(selectedFaculty)
      }
    }
  })

  // Event listener for keyboard activation of faculty cards (Space/Enter)
  facultyGrid.addEventListener('keydown', (event) => {
    const card = event.target.closest('.faculty-card')
    if (card && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault() // Prevent default spacebar action (e.g. scrolling)
      currentlyFocusedCard = card
      const facultyId = card.dataset.id
      const selectedFaculty = facultyData.find((f) => f.id === facultyId)
      if (selectedFaculty) {
        openModal(selectedFaculty)
      }
    }
  })

  // Event listeners for closing the modal
  modalCloseButton.addEventListener('click', closeModal)
  modalOverlay.addEventListener('click', (event) => {
    // Close modal if overlay itself is clicked, not content inside
    if (event.target === modalOverlay) {
      closeModal()
    }
  })
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalOverlay.classList.contains('is-open')) {
      closeModal()
    }
  })

  // Accessibility: Trap focus within the modal
  function trapModalFocus(event) {
    // Query for all focusable elements within the modal
    const focusableElements = modalOverlay.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    // Ensure there are focusable elements to prevent errors if modal is empty
    if (focusableElements.length === 0) return

    const firstFocusableElement = focusableElements[0]
    const lastFocusableElement = focusableElements[focusableElements.length - 1]

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        // Shift + Tab (move backward)
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus()
          event.preventDefault()
        }
      } else {
        // Tab (move forward)
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus()
          event.preventDefault()
        }
      }
    }
  }

  // Initial render of faculty cards when the page loads
  renderFacultyCards()
})
