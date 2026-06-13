def findDifference(N, nums):
    evensum=0
    oddsum=0
    for i in nums:
        if i%2==0:
            evensum+=i
        else:
            oddsum+=i
    return evensum-oddsum