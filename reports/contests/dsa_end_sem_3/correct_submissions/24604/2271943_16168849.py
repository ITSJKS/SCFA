def findDifference(N, nums):
    sumEven = 0 
    sumOdd = 0 
    for i in nums:
        if i%2==0:
            sumEven+=i
        else:
            sumOdd+=i 
    return sumEven-sumOdd