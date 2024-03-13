<template>
    <LayoutSidebar>
  
      <div class="content">
  
        <div class="chart-grid">
            <ContentBox class="grid-content-box tax-manager-content-box">
                
                <div class="chart-box">

                    <div class="chart">
    
                        <div class="growth-lines">
    
                            <div class="line"></div>
                            <div class="line"></div>
                            <div class="line"></div>
                            <div class="line"></div>
                            <div class="line"></div>
    
                        </div>
    
                        <div class="numeration">
                            <div class="number">01</div>
                            <div class="number">02</div>
                            <div class="number">03</div>
                            <div class="number">04</div>
                            <div class="number">05</div>
                            <div class="number">06</div>
                            <div class="number">07</div>
                            <div class="number">08</div>
                        </div>
    
                        <div class="chart-columns">
    
                            <div class="column-group">
                                <div class="column first-column"></div>
                                <div class="column second-column"></div>
                            </div>
    
                            <div class="column-group">
                                <div class="column first-column"></div>
                                <div class="column second-column"></div>
                            </div>
    
                            <div class="column-group">
                                <div class="column first-column"></div>
                                <div class="column second-column"></div>
                            </div>
    
                            <div class="column-group">
                                <div class="column first-column"></div>
                                <div class="column second-column"></div>
                            </div>
    
                            <div class="column-group">
                                <div class="column first-column"></div>
                                <div class="column second-column"></div>
                            </div>
    
                            <div class="column-group">
                                <div class="column first-column"></div>
                                <div class="column second-column"></div>
                            </div>
    
                            <div class="column-group">
                                <div class="column first-column"></div>
                                <div class="column second-column"></div>
                            </div>
    
                            <div class="column-group">
                                <div class="column first-column"></div>
                                <div class="column second-column"></div>
                            </div>
    
                        </div>
    
                    </div>

                </div>

            </ContentBox>

            <ContentBox class="tax-manager-content-box">
                <div class="dashboard-text">
                    <p>Lorem ipsum dolor sit amet</p>
                    <h3>R$210.258</h3>
                </div>
            </ContentBox>
        </div>
  
        <div class="dashboard-grid">
          <ContentBox class="tax-manager-content-box vertical">

            <div class="dashboard-text">
                <p>Lorem ipsum dolor</p>
                <h3>1.284</h3>
            </div>
            
          </ContentBox>
  
          <ContentBox class="tax-manager-content-box vertical">
            <div class="dashboard-text">
                <p>Lorem ipsum dolor</p>
                <h3>504</h3>
            </div>
            
          </ContentBox>

          <ContentBox class="tax-manager-content-box vertical">
            <div class="dashboard-text">
                <p>Lorem ipsum dolor</p>
                <h3>2850</h3>
            </div>
            
          </ContentBox>
  
          <ContentBox class="tax-manager-content-box vertical">
            <div class="dashboard-text">
                <p>Lorem ipsum dolor</p>
                <h3>10.258</h3>
            </div>
            
          </ContentBox>

          <ContentBox class="tax-manager-content-box vertical">
            <div class="dashboard-text">
                <p>Lorem ipsum dolor</p>
                <h3>560.428</h3>
            </div>
            
          </ContentBox>
  
          <ContentBox class="tax-manager-content-box vertical">
            <div class="dashboard-text">
                <p>Lorem ipsum dolor</p>
                <h3>85.258</h3>
            </div>
            
          </ContentBox>

          <ContentBox class="tax-manager-content-box vertical">
            <div class="dashboard-text">
                <p>Lorem ipsum dolor</p>
                <h3>47.298</h3>
            </div>
            
          </ContentBox>
  
          <ContentBox class="tax-manager-content-box vertical">
            <div class="dashboard-text">
                <p>Lorem ipsum dolor</p>
                <h3>200.298</h3>
            </div>
            
          </ContentBox>
  
        </div>
  
      </div>
  
    </LayoutSidebar>
  </template>
  
  <script setup>

  </script>
  
  <style scoped lang="less">
  
    .content{
        margin-bottom: 100px;
        width: 100%;

        .chart-grid{
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 30px;
        }

      .dashboard-grid{
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        margin-top: 25px;
        gap: 30px;

        .content-box .dashboard-text{
            h3{
                font-size: 48px;
            }
        }
      }
  
      .content-box{


        &.grid-content-box{
            overflow-x: auto;
        }
       
        .chart-box{
            padding-bottom: 125px;
            height: 225px;
            

            .chart{
                width: 100%;
                height: 100%;
                padding-bottom: 50px;
                position: relative;
    
                .growth-lines{
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
    
                    .line{
                        width: 100%;
                        height: 1px;
                        background: #70707070;
                    }
                }

                .numeration{
                    display: grid;
                    grid-template-columns: repeat(8, 1fr);
                    place-items: center;
                    position: absolute;
                    left: 0px;
                    bottom: -50px;
                    width: 100%
                }

                .chart-columns{
                    width: 100%;
                    display: grid;
                    grid-template-columns: repeat(8, 1fr);
                    place-items: center;
                    position: absolute;
                    left: 0px;
                    bottom: 0px;
                    z-index: 5;

                    .column-group{
                        display: flex;
                        align-items: end;
                        gap: 10px;

                        .column{
                            width: 25px;
                            height: 50px;

                            &.first-column{
                                background: @primaryYellow;
                            }

                            &.second-column{
                                background: @primaryBlue;
                            }
                        }
                        
                    }
                }
            }

        }
  
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        .soft-transition();

        &:hover:not(.grid-content-box){
            background: @primaryBlue;

            .dashboard-text{
                p{
                    color: #FFF;
                }

                h3{
                    color: @primaryYellow;
                }
            }
        }

        &.vertical{
          flex-direction: column;
        }

        .dashboard-text{
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            height: 200px;
            gap: 10px;

            p{
                font-size: 18px;
            }

            h3{
                font-size: 78px;
            }

        }
        
      }
    }

    @media only screen and (max-width: 1480px){
        .content{
            .chart-grid{
                gap: 10px;
            }

            .dashboard-grid {
                margin-top: 10px;
                gap: 10px;
            }
        }
    }

    @media only screen and (max-width: 1280px){
        .content .dashboard-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media only screen and (max-width: 1024px){
        .content .chart-grid {
            grid-template-columns: 1fr;
        }
    }

    @media only screen and (max-width: 600px){
        .content .dashboard-grid {
            grid-template-columns: 1fr;

            .content-box{
                width: 100%;
            }
        }
    }

    @media only screen and (max-width: 450px){
        .content .content-box .chart-box .chart .chart-columns .column-group{
            gap: 2px;
            .column {
                width: 15px;
                height: 50px;
            }
        }

        .content .content-box .dashboard-text h3{
            font-size: 54px;
        }


    }
  
  </style>