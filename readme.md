Garden Planner Official README.md page
Collaborators: Ashton Hamm, Ethan Black, Clayton Conly, Pardhu Tadikonda

==================================================================================
#					Set up Virtual Environment:
==================================================================================

## 1. Setup your virtual environment (IMPORTANT!!!)
- Purpose: The system-wide Python Interpretor is what is being modified when installing/changing Python packages. 
However, using the wrong version of a web application's required packages will cause the application 
to break unexpectedly.

######	1.1 Create the project folder that will host the associated virtual environment and the project files.
			
			$ mkdir projectName
			$ cd projectName

######	1.2 Create a virtual environment subdirectory 
- NOTE:  If you are using a Python 3 version, virtual environment support is included in it, so all you 
need to do to create one is this (replace name with your virtual environment's name):
			
			$ python3 -m venv name

- If you are using any version of Python older than 3.4 (and that includes the 2.7 release), virtual 
environments are not supported natively. For those versions of Python, you need to download and 
install a third-party tool called virtualenv before you can create virtual environments. Once 
virtualenv is installed, you can create a virtual environment with the following command:
		
			$ virtualenv venv

## 2. Activate your virtual environment
- Purpose: The system-wide Python Interpretor is what is being modified when installing/changing Python packages. 

- Since we are already in the project directory we created in step 1.1, we can now use the activation function 
to turn-on and initialize the virtual environment:

######	OSX/Linux:	

		$ source venv/bin/activate
######	 Windows:	

		$ venv\Scripts\activate

- The command above will return this new isolated python interpreter. (venv) is the name we gave the environment:
		  
		(venv) $ _

# Now you are ready to install Flask and any other required packages using Python's package manager: pip


## Final notes about virtual environments:
- When you activate a virtual environment, the configuration of your terminal session is modified so that the Python interpreter 
stored inside it is the one that is invoked when you type python. Also, the terminal prompt is modified to include the name of 
the activated virtual environment. 
- The changes made to your terminal session are all temporary and private to that session, so 
they will not persist when you close the terminal window. If you work with multiple terminal windows open at the same time, it 
is perfectly fine to have different virtual environments activated on each one.

==================================================================================
#				How to run the Web Application:
==================================================================================

- First, your command prompt should be in the activated virtual environment for that web application. 
  Example of the activated virtual environment  from step 2:

		(venv) $ _


- After downloading and extracing to the project folder we created in step 1.1, cd to directory containing app.py

		 (venv) $ cd projectName/

- Run the following command:

		 (venv) $ export FLASK_APP=app.py

- Run the following command to start the application server inside of the virtual environment:

		 (venv) $ flask run

Useful docs:
http://flask.pocoo.org/docs
