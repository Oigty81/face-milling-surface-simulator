<template>
    <div class="mx-2">
        <div class="row my-2">
            <div class="col">
                <h2>Quick Guide</h2>
            </div>
        </div>
        <div class="row mt-2">
            <div class="col-lg-4 mt-2">
                <img class="img-help" src="../../assets/help/simulate.gif" alt="-">
            </div>
            <div class="col-lg-8 mt-2">
                <h3 class="mb-1">This application simulates milling paths and roughness marks.</h3>
                <h3 class="mb-1">The color of the milling surface in the image must be known in order to render the roughness on it.</h3>
                <h3 class="mb-1">In addition, the NC origin on the image and the relation (pixel / mm) must be specified.</h3>
                <h3 class="mb-1">A CNC program (text file) can be uploaded and executed.</h3>
                <h3 class="mb-1">Parameters such as mill diameter, mill color and roughness marks color can be set optionally.</h3>
                <h3 class="mb-1">The entire profile setup can be downloaded to use it again later.</h3>
            </div>
        </div>
        <div class="row my-2">
            <div class="col">
                <hr class="hr-line-white">
            </div>
        </div>
        <div class="row my-2">
            <div class="col">
                <h2>Overview</h2>
                <br>
                <div class="row mt-2">
                    <div class="col-lg-4 mt-2">
                        <img class="img-help" src="../../assets/help/mainOverview.png" alt="-">
                    </div>
                    <div class="col-lg-4 mt-2">
                        <h3 class="mb-3">1. Simulator canvas</h3>
                        <h3 class="mb-3">2. NC Control Section</h3>
                        <h3 class="mb-3">3. Render Control Section</h3>
                        <h3 class="mb-3">4. Profile Control Section</h3>
                        <h3 class="mb-3">5. Upload and Download Control Section</h3>
                        <h3 class="mb-3">6. NC Program Console</h3>
                        <h3 class="mb-3">7. Message Console</h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="row my-2">
            <div class="col">
                <hr class="hr-line-white">
            </div>
        </div>
        <div class="row my-2">
            <div class="col">
                <h2>NC Control Section</h2>
            </div>
        </div>
        <div class="row my-2">
            <div class="col-lg-4 mt-2">
                <img class="img-help" src="../../assets/help/ncControlSection.png" alt="-">
            </div>
            <div class="col-lg-8 mt-2">
                <h3 class="mb-3">- start, stop or reset the NC Engine</h3>
                <h3 class="mb-3">- the slider adjusts the simulation speed</h3>
            </div>
        </div>
        <div class="row my-2">
            <div class="col">
                <hr class="hr-line-white">
            </div>
        </div>
        <div class="row my-2">
            <div class="col">
                <h2>Render Control Section</h2>
            </div>
        </div>
        <div class="row my-2">
            <div class="col-lg-4 mt-2">
                <img class="img-help" src="../../assets/help/renderControlSection.png" alt="-">
            </div>
            <div class="col-lg-8 mt-2">
                <h3 class="mb-3">- zoom the simulator canvas</h3>
                <h3 class="mb-3">- download the currently rendered image from the memory</h3>
                <h3 class="mb-3">- the slider is used to set the number of NC samples after which an image is rendered in the simulator canvas</h3>
                <h3 class="mb-3">- reset the roughness tracks</h3>
            </div>
        </div>
        <div class="row my-2">
            <div class="col">
                <hr class="hr-line-white">
            </div>
        </div>
        <div class="row my-2">
            <div class="col">
                <h2>Profile Control Section</h2>
            </div>
        </div>
        <div class="row my-2">
            <div class="col-lg-4 mt-2">
                <img class="img-help" src="../../assets/help/profileControlSection.png" alt="-">
            </div>
            <div class="col-lg-8 mt-2">
                <h3 class="mb-3">- show the current profile configuration</h3>
                <h3 class="mb-3">- click settings button to change the profile</h3>
            </div>
        </div>
        <div class="row my-2">
            <div class="col">
                <hr class="hr-line-white">
            </div>
        </div>

        <div class="row my-2">
            <div class="col">
                <h2>Upload and Download Control Section</h2>
            </div>
        </div>
        <div class="row my-2">
            <div class="col-lg-4 mt-2">
                <img class="img-help" src="../../assets/help/upAndDownloadControlSection.png" alt="-">
            </div>
            <div class="col-lg-8 mt-2">
                <h3 class="mb-3">- the current profile and nc program can be deleted, downloaded or uploaded</h3>
                <h3 class="mb-3">- the profile file is in JSON format and the nc program file is a plain text file (see below)</h3>
                <h3>- to save a current profile, click the "profile download" button </h3>
                <p class="mb-3">{{'\xa0\xa0\xa0'}} (Any profile file can be uploaded again. Drag the file onto the "upload profile-file" field.)</p>
                <h3>- NC programs are also uploaded in this way</h3>
                <p class="mb-3">{{'\xa0\xa0\xa0'}} (Drag the text file onto the "upload nc-file" field.)</p>
            </div>
        </div>
        <div class="row my-2">
            <div class="col">
                <hr class="hr-line-white-lg">
            </div>
        </div>
        <div class="row my-2">
            <div class="col">
                <h2>Go to Profile-Settings</h2>
                <br>
                <div class="row mt-2">
                   <div class="col-md-2 my-auto">
                       <h3>click the setting button{{'\xa0\xa0'}}<i class="fas fa-arrow-right"></i></h3>
                   </div>
                   <div class="col-md-2 my-auto">
                       <img class="img-help" src="../../assets/help/goToSettings1.png" alt="-">
                   </div>
                   <div class="col-md-2 my-auto">
                       <h3>alternate click on navbar{{'\xa0\xa0'}}<i class="fas fa-arrow-right"></i></h3>
                       
                   </div>
                   <div class="col-md-2 my-auto">
                       <img class="img-help" src="../../assets/help/goToSettings2.png" alt="-">
                   </div>
                </div>
            </div>
        </div>
        <div class="row my-2">
            <div class="col">
                <hr class="hr-line-white">
            </div>
        </div>
        <div class="row my-2">
            <div class="col">
                <h2>Overview Profile-Settings</h2>
                <div class="row mt-2">
                    <div class="col-lg-4 mt-2">
                        <img class="img-help" src="../../assets/help/settingsOverview.png" alt="-">
                    </div>
                    <div class="col-lg-8 mt-2">
                        <h3 class="mb-3"> 1. apply or cancel the current settings</h3>
                        <h3 class="mb-3"> 2. clear or upload an image (png or bmp)</h3>
                        <h3 class="mb-3"> 3. set colors for tool, roughness tracks and touched on image</h3>
                        <h3 class="mb-3"> 4. set the origin for the NC on image</h3>
                        <h3 class="mb-3"> 5. set the relation (image pixel per millimeter)</h3>
                        <h3 class="mb-3"> 6. set tool diameter in millimeter</h3>
                        <h3 class="mb-3"> 7. set nc startpoint (nc initial position)</h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="row my-2">
            <div class="col">
                <hr class="hr-line-white">
            </div>
        </div>
        <div class="row my-2">
            <div class="col">
                <h2>Set the NC Origin on image</h2>
                <br>
                <div class="row mt-2">
                    <div class="col-lg-4 mt-2">
                        <img class="img-help" src="../../assets/help/setNcOriginOnImage.png" alt="-">
                    </div>
                    <div class="col-lg-8 mt-2">
                        <h3 class="mb-3">Click on the canvas to set the NC origin.</h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="row my-2">
            <div class="col">
                <hr class="hr-line-white">
            </div>
        </div>
        <div class="row my-2">
            <div class="col">
                <h2>Set the relation (image pixel per millimeter)</h2>
                <br>
                <div class="row mt-2">
                    <div class="col-lg-3 mt-2">
                        <img class="img-help" src="../../assets/help/setRelation1.png" alt="-">
                    </div>
                    <div class="col-lg-2 mt-2">
                        <img class="img-help" src="../../assets/help/setRelation2.png" alt="-">
                    </div>
                    <div class="col-lg-7 mt-2">
                        <h3 class="mb-3">Determine a length in pixels across the canvas. The first click starts and the second click ends the determination.</h3>
                        <h3 class="mb-3">A modal appears...</h3>
                        <h3 class="mb-3">Now set the length in millimeters for the currently measured pixel length.</h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="row my-2">
            <div class="col">
                <hr class="hr-line-white-lg">
            </div>
        </div>
        <div class="row my-2">
            <div class="col">
                <h2 class="mb-2">NC Program (text file)</h2>
                <h3 class="mt-1">The NC program is plain text. These text files can be uploaded via the field "upload nc-program".</h3>
                <h3 class="mt-3">- applicable NC address-commands (in this order): <span class="header-text-3 nc-text">N, G, X, Y, Z, CR, TR, F</span></h3>
                <h3 class="mt-1">- address N is optional and describes the block number</h3>
                <h3 class="mt-1">- address G describes the type of movement: G1 (linear), G2 (circular interpolation clockwise) or G3 (circular interpolation anti-clockwise)</h3>
                <h3 class="mt-1">- address X and Y describes the destination of the block</h3>
                <h3 class="mt-1">- address CR describes the radius for circular interpolation</h3>
                <h3 class="mt-1">- address TR is the transition radius between two blocks</h3>
                <h3 class="mt-1">- address F is the feed per rotation. (This value is imaginary for the simulator)</h3>
                <h3 class="mt-1">- for the address CR and TR it is necessary to put an equal sign in front of the value:
                    {{'\xa0\xa0'}}
                    <span class="header-text-3 nc-text">CR</span>
                    <span class="header-text-3 nc-text text-warning">=</span>
                    <span class="header-text-3 nc-text">10.5</span>
                    {{'\xa0\xa0'}}
                    <span class="header-text-3 nc-text">TR</span>
                    <span class="header-text-3 nc-text text-warning">=</span>
                    <span class="header-text-3 nc-text">2.3</span>
                </h3>
                <h3 class="mt-1">- the addresses TR and F are modal</h3>
                <h3 class="mt-3 text-warning">The first block is calculated from the configured NC starting point.</h3>
            </div>
        </div>
        <div class="row my-2">
            <div class="col">
                <hr class="hr-line-white">
            </div>
        </div>
        <div class="row">
            <div class="col">
                <h2 class="mt-1 mb-2">NC block examples</h2>
                <div class="row mt-2">
                   <div class="col-lg-4">
                       <h3>
                           <span class="header-text-3 nc-text">G1 X100.3 Y10 F0.4</span>
                           {{'\xa0\xa0'}}<i class="fas fa-arrow-right"></i>{{'\xa0\xa0'}}
                       </h3>
                   </div>
                   <div class="col-lg-8">
                        <h3>
                            Linear movement to the destination X 100.3mm and Y 10mm with a feed of 0.4.
                        </h3>
                   </div>
                </div>
                <div class="row mt-2">
                   <div class="col-lg-4">
                       <h3>
                           <span class="header-text-3 nc-text">G2 X50 Y40 CR=80</span>
                           {{'\xa0\xa0'}}<i class="fas fa-arrow-right"></i>{{'\xa0\xa0'}}
                       </h3>
                   </div>
                   <div class="col-lg-8">
                        <h3>
                            Circular interpolation clockwise to the destination X 50 mm and Y 40 mm with a radius of 80 mm.
                        </h3>
                   </div>
                </div>
                <div class="row mt-2">
                   <div class="col-lg-4">
                       <h3>
                           <span class="header-text-3 nc-text">G3 X64 CR=95 TR=2</span>
                           {{'\xa0\xa0'}}<i class="fas fa-arrow-right"></i>{{'\xa0\xa0'}}
                       </h3>
                   </div>
                   <div class="col-lg-8">
                        <h3>
                            Circular interpolation anti-clockwise to the destination X 64 mm with a radius of 95 mm. A modal transition radius of 2mm is also specified here.
                        </h3>
                   </div>
                </div>
                <div class="row mt-2">
                   <div class="col-lg-4">
                       <h3>
                           <span class="header-text-3 nc-text">N1 G=1 X=99.33 Y=20.44 F=1.2</span>
                           {{'\xa0\xa0'}}<i class="fas fa-arrow-right"></i>{{'\xa0\xa0'}}
                       </h3>
                   </div>
                   <div class="col-lg-8">
                        <h3>
                            An example of alternative notation.
                        </h3>
                   </div>
                </div>
                
            </div>
        </div>
        <div class="row my-2">
            <div class="col">
                <hr class="hr-line-white-lg">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HelpContent',
};
</script>
