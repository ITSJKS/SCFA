def findDifference(N, nums):
    even=0
    odd=0
    for i in range(N):
        if nums[i]%2!=0:
            odd+=nums[i]
           
        else:
            even+=nums[i]
        
   
    

          
        
    ans=even-odd
    return ans