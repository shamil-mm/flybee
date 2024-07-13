    
        
        (function ($) {
            "use strict";

            let chart;

            var ctx = document.getElementById('myChart').getContext('2d');

           
            async function fetchData(filter) {
                const response = await fetch(`/admin/salesData?filter=${filter}`, { method: "POST" });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                return data;
            }


            async function updateChart(filter) {
                const data = await fetchData(filter);
                // console.log(data);
                chart.data.labels = data.labels;
                chart.data.datasets[0].data = data.sales;
                chart.data.datasets[1].data = data.newUsers;
                chart.data.datasets[2].data = data.newProducts;
                chart.update();
            }

            /* Initial chart setup */
            if ($('#myChart').length) {
                chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels:[],
                        datasets: [{
                            label: 'Sales',
                            tension: 0.3,
                            fill: true,
                            backgroundColor: 'rgba(44, 120, 220, 0.2)',
                            borderColor: 'rgba(44, 120, 220)',
                            data: [].sales
                        },
                        {
                            label: 'Users',
                            tension: 0.3,
                            fill: true,
                            backgroundColor: 'rgba(4, 209, 130, 0.2)',
                            borderColor: 'rgb(4, 209, 130)',
                            data: [].visitors
                        },
                        {
                            label: 'Products',
                            tension: 0.3,
                            fill: true,
                            backgroundColor: 'rgba(380, 200, 230, 0.2)',
                            borderColor: 'rgb(380, 200, 230)',
                            data: [].products
                        }]
                    },
                    options: {
                        plugins: {
                            legend: {
                                labels: {
                                    usePointStyle: true
                                }
                            }
                        }
                    }
                });
            }

            /* Functionality to switch data */
            $('#yearlyBtn').on('click', function () {
                updateChart('Yearly');
            });

            $('#monthlyBtn').on('click', function () {
                updateChart('Monthly');
            });

            $('#weeklyBtn').on('click', function () {
                updateChart('Weekly');
            });
            $(window).on('load', function() {
                updateChart('Weekly');
                
            });
            


            
           
            if ($('#myChart2').length) {
                
                var ctx2 = document.getElementById("myChart2").getContext('2d');
                $(window).on('load', function() {
                    fetchDataTwo();
                    
                });
                
                
              
             async function fetchDataTwo() {
                    
                    const response = await fetch(`/admin/bestSellingProducts`, { method: "POST" });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                  const  data = await response.json();
                //   console.log(data.labels)
                //   console.log(data.data)
                    
                   
                
               

            
                // Sales data
                var salesData = data.data
                
                // Find the maximum sales value
                var maxSales = Math.max(...data.data);
                // Index of the product with the highest sales
                var bestProductIndex = salesData.indexOf(maxSales);
            
                // Colors for the bars, with the best product in a different color
                var barColors = ["#5897fb", "#7bcf86", "#ff9076", "#d595e5"];
                var highlightColor = "#f39c12"; // Color for the best product
                barColors[bestProductIndex] = highlightColor;
            
                var myChart2 = new Chart(ctx2, {
                    type: 'bar',
                    data: {
                        labels: data.labels, // Update these with your product names
                        datasets: [
                            {
                                label: "Sales",
                                backgroundColor: barColors, // Colors for each product
                                barThickness: 25,
                                data: salesData // Update these with your sales figures
                            }
                        ]
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: false // Hide legend if only one dataset
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(tooltipItem) {
                                        return 'Sales: ' + tooltipItem.raw;
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Units Sold' // Label for the y-axis
                                },
                                grid: {
                                    display: false // Remove y-axis grid lines
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Products' // Label for the x-axis
                                },
                                grid: {
                                    display: false // Remove x-axis grid lines
                                }
                            }
                        }
                    }
                });
            }
        }
        })(jQuery);
    