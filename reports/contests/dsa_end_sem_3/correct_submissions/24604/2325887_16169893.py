def findDifference(N, nums):
    odd = 0
    even = 0

    for num in nums:
        if num%2==0:
            even+=num
        else:
            odd+=num

    return (even-odd)