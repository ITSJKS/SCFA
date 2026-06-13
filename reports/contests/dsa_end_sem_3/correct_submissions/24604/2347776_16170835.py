def findDifference(N, nums):
    ev,od=0,0
    for i in nums:
        if i%2==0:
            ev+=i 
        else:
            od+=i    
    return ev-od