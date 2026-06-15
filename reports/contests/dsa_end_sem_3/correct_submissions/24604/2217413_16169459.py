def findDifference(N, nums):
    odd=0
    even=0
    for i in nums:
        if i%2==0:
            even+=i 
        else:
            odd+=i
    return even-odd