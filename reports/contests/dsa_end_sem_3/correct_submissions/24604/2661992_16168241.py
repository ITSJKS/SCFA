def findDifference(N, nums):
    ans=0
    for i in nums:
        if i%2==0:
            ans+=i
        else:
            ans-=i 
    return ans