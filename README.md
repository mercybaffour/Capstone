# Capstone
Final capstone project 

**Automating the Data Collection and Preprocessing Phases for Data Scientists to Construct Machine Learning Models for Drug Discovery**

Overview:
Retrieve and download biological activity data of compounds from ChEBL API. This will be a test/sample project that simulates making the data collection and data pre-processing steps easier for data scientists.  Data scientists can use this data to construct machine learning models. QSAR (Quantitative Structure Activity Relationship) models hold great value for drug discovery efforts, particularly in designing effective drugs. Website idea will be for data scientists to query target keywords (target organisms/proteins) from ChEMBL API that will be relevant to build a QSAR model. Data retrieved will be outputted to a CSV that they can use for their modeling and drug discovery efforts.

Web Page Layout - List of Pages and Features:

HOME - Present tool for scientists to download processed CSV file.

ABOUT- explain what the QSAR predictive model is and its use for drug discovery

COMPOUND REPORT CARDS - See end of document for description of Idea#2 (may not be part of website if including this is too ambitious)

RESOURCES - More resources on bioactive compounds/entities for research

API - https://www.ebi.ac.uk/chembl/api/data/activity/

What is ChEMBL?:
“ChEMBL is a manually curated database of bioactivity data on small drug-like molecules, used by drug discovery scientists. Among many access methods, a REST API provides programmatic access, allowing the remote retrieval of ChEMBL data and its integration into other applications. This approach allows scientists to move from a world where they go to the ChEMBL web site to search for relevant data, to one where ChEMBL data can be simply integrated into their everyday tools and work environment.”

“At the time of writing, the latest version (22) of the database contains 1.6 million distinct compounds, 14 million bioactivities, 11k biological targets and other related data organized in 72 tables.”

Another important feature of the ChEMBL API is that it is based on REpresentational State Transfer (REST) architecture. In practice, this means that ChEMBL web services can be accessed by all of the most important programming languages, such as Java, Python, JavaScript and others. 

ChEMBL web services provide access to a wide range of data types from the ChEMBL database, including but not limited to molecules, targets, drug mechanisms of action, bioactivity measurements and documents. In total, there are 25 distinct endpoints, each providing data about different entities.

Data Collection Phase:

Select and retrieve bioactivity data for a target protein/organism. The example we’ll use to demonstrate this phase is SARS coronavirus 3C-like proteinase.
target_chembl_id - ‘CHEMBL2927’ (unique identification of target)
Retrieve only bioactivity data for compounds that target coronavirus 3C-like proteinase (CHEMBL3927) that are reported as IC50 value.
Select/filter for standard_type=”IC50” (bioactivity unit types)
Notice standard_value (this describes the potency of drug; the lower the better (a lower drug concentration provides an inhibitory effect/ inhibitory concentration at 50% will have a low concentration)

Data Pre-Processing of the bioactivity data:
1). For the benefit of machine learning models, we need to classify categories as active, inactive, or intermediary compounds. We can title this as bioactivity_class.

Use a loop to iterate over standard value values.
Active - <= 1000;
Inactive- >= 10000;
Intermediate- everything else 

2)Iterate over molecule_chembl_id:
Multiple rows may contain the same id, so we have to eliminate redundancy. Find a way to eliminate duplicates.

3), 4) Do this for canonical_smiles, standard_value, 

Purpose:
Note that canonical_smiles provides information about the chemical structure of the compound. Scientists will use this to compute their molecular descriptors. The usefulness of this is that in a future project, a given compound with certain molecular descriptors will be applied into a predictive model. This predictive model will make a prediction about the compound’s biological activity--basically whether it is active or inactive. The model will also be able to provide insights on which structural features are important. This information will be important in scientists’ design of future drugs that can hopefully have robust properties.

End Result: Save filtered/pre-processed bioactivity data to a CSV file. (Use a library or something else for this?) You should have a table with 4-6 columns with the four values described above, and X amount of rows representing the # of compounds. File should not contain redundant data and should be fully pre-processed.

We can use this pre-processed data for subsequent machine learning models.

Idea #2- Compound Report Cards (Web Widgets) using ChEMBL API

Create and display compound report cards using reusable web components. These report cards will display the bioactivity profile of users’ compounds of interest. Use JS and CSS files, that when loaded into the web browser, can use data from the REST API to create a dynamic view for users.



